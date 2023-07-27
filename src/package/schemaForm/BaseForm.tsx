import { Form, Row, Col, FormItem, Space, Button } from "ant-design-vue";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons-vue";
import {
  PropType,
  Ref,
  defineComponent,
  inject,
  provide,
  ref,
  renderSlot,
  toRef,
} from "vue";
import { formControlEnum, schemaFormType } from "./types/form";
import { componentMap } from "./types/data";
import { cloneDeep } from "lodash-es";
/**
 * @description: 最终渲染的表单项
 * @return {*}
 */
const BaseFormControl = defineComponent({
  props: {
    schema: {
      type: Object as PropType<schemaFormType>,
      required: true,
    },
    formInfo: {
      // 这个是用于formlist的时候内部表单项依赖的响应式数据
      type: Object as PropType<Record<string, any>>,
    },
  },
  setup(props) {
    const { schema, formInfo } = props;
    // 获取Form容器传递的model和slots数据
    const formData = inject<Ref>("formData");
    const slots = inject("slots");

    if (!slots) return null;

    if (schema.hideInForm) {
      return null;
    }
    if (schema.renderFormItem) {
      return () => schema.renderFormItem;
    }
    const targetFormData = formInfo
      ? formInfo[schema.dataIndex!]
      : formData?.value[schema.dataIndex!];
    // 判断是否自定义了插槽，有直接渲染插槽
    if (slots && schema.slot && Reflect.has(slots, schema.slot)) {
      return () =>
        renderSlot(slots, schema?.slot, {
          schema: schema,
          data: targetFormData,
        });
    }
    const ItemDom = componentMap.get(schema.controlType);
    if (!ItemDom) {
      throw Error(`${schema.controlType}: 不在渲染组件中`);
    }
    return () => {
      // formList 时双向绑定的数据
      if (!formInfo) {
        return (
          ItemDom && (
            <ItemDom
              {...schema.controlRenderPops}
              v-model:value={formData!.value[schema.dataIndex!]}
            ></ItemDom>
          )
        );
      }
      return (
        ItemDom && (
          <ItemDom
            {...schema.controlRenderPops}
            v-model:value={formInfo[schema.dataIndex!]}
          ></ItemDom>
        )
      );
    };
  },
});
/**
 * @description: formList 情况下的渲染组件
 * @return {*}
 */
const BaseFormFormList = defineComponent({
  props: {
    schema: {
      type: Object as PropType<schemaFormType>,
      required: true,
    },
    index: {
      type: Number, // 存在嵌套formList 使用
    },
    parentFields: {
      type: Array as PropType<string[]>, // 存在嵌套formList 使用
    },
  },
  setup(props) {
    // 获取Form容器传递的数据
    const formData = inject<Ref>("formData");
    const slots = inject("slots");

    const { schema, index } = props;
    const parentFields = cloneDeep(props.parentFields);
    if (schema.hideInForm) {
      return;
    }
    if (!schema.dataIndex) {
      throw new Error("外层formList 请设置dataIndex 否则不知道谁需要收集数据");
    }
    // 将需要渲染的数据转化为响应式，方便内部数据变化进行重渲染，而不需要外层传入，减小渲染开销，提供性能
    let mapData = ref(formData?.value?.[schema.dataIndex] as any[]);
    // 嵌套时的数据
    if (parentFields) {
      // 嵌套时，通过归并的方式获取到嵌套数据在model中的值
      const middle = parentFields.reduce((obj, key) => {
        return obj[key];
      }, formData?.value);
      // 获取当前层级下的list数据
      if (index !== undefined) {
        mapData.value = middle[index][schema.dataIndex];
      }
    }
    /**
     * @description: 添加一行
     * @return {*}
     */
    const addFormList = () => {
      // 无初始值时
      if (!mapData.value) {
        mapData.value = [];
        // 嵌套
        if (parentFields) {
          let currentObj = formData?.value;
          // 遍历设置每一项的数据
          parentFields.forEach((field) => {
            if (!currentObj[field]) {
              currentObj[field] = {};
            }
            currentObj = currentObj[field];
          });
          // 反向绑定数据到formData，供外部使用
          if (schema.dataIndex && index !== undefined) {
            currentObj[index][schema.dataIndex!] = mapData.value;
          }
        } else {
          // 把值回填用于外部获取数据
          if (schema.dataIndex) {
            formData!.value[schema.dataIndex!] = mapData.value;
          }
        }
      }
      // 追加一项
      mapData.value.push({});
    };
    /**
     * @description: 删除一行
     * @param {number} index
     * @return {*}
     */
    const delFormList = (index: number) => {
      mapData.value.splice(index, 1);
    };
    // 添加按钮 如果用了插槽就要用插槽内容
    const addButtonDom = (
      <FormItem>
        {slots &&
        schema.formListProps?.addButtonSlot &&
        Reflect.has(slots, schema.formListProps?.addButtonSlot) ? (
          renderSlot(slots, schema.formListProps?.addButtonSlot, {
            schema: schema,
          })
        ) : (
          <Button
            type="dashed"
            onClick={addFormList}
            {...schema.formListProps?.addButtonProps}
          >
            <PlusOutlined />
            {schema.formListProps?.addButtonProps?.text || "添加"}
          </Button>
        )}
      </FormItem>
    );
    // 删除按钮，如果时slot将删除项的data 和 index 回传出去
    const delButtonDom = (data: any, index: number) => {
      return slots &&
        schema.formListProps?.delButtonSlot &&
        Reflect.has(slots, schema.formListProps?.delButtonSlot) ? (
        renderSlot(slots, schema.formListProps?.delButtonSlot, {
          schema: schema,
          data: { index, data },
        })
      ) : (
        <Button
          type="link"
          {...schema.formListProps?.delButtonProps}
          onClick={() => {
            if (schema.formListProps?.delButtonProps?.onClick) {
              schema.formListProps?.delButtonProps?.onClick?.(data, index);
            } else {
              delFormList(index);
            }
          }}
        >
          <MinusCircleOutlined style={{ cursor: "pointer" }} />
        </Button>
      );
    };
    return () => {
      return (
        <>
          {mapData.value &&
            mapData.value.map((el, index) => {
              const formList = {
                data: el,
                index,
                dataIndex: schema.dataIndex!,
              };
              return (
                <Space
                  key={el}
                  align="baseline"
                  {...schema.formListProps?.spaceProps}
                >
                  {schema.columns && (
                    <BaseFormItemWithOut
                      columns={schema.columns}
                      col={false}
                      formList={formList}
                      parentFields={parentFields}
                    ></BaseFormItemWithOut>
                  )}

                  {delButtonDom(el, index)}
                </Space>
              );
            })}
          {addButtonDom}
        </>
      );
    };
  },
});
/**
 * @description: 这个是用来进行对表单项添加外层FormItem 和 Row Space Col等操作的
 * @return {*}
 */
const BaseFormItemWithOut = defineComponent({
  props: {
    columns: {
      // 每一项的schema配置项
      type: Array as PropType<schemaFormType[]>,
      required: true,
    },
    col: {
      // 是否需要包裹Col组件，通常用于group的情况需要包裹方便布局
      type: Boolean,
      default: false,
    },
    formList: {
      // 当为formList的情况时，需要传递渲染的响应式数据
      type: Object as PropType<{
        data: Record<string, any>; // list依赖的响应式数据
        index: number; // 只是用于list 嵌套list的情况下，让内层list知道依赖于外层的那一层
        dataIndex: string; // 只是用于list 嵌套list的情况下，收集外层依赖项的name
      }>,
    },
    parentFields: {
      type: Array as PropType<string[]>, // formlist 嵌套情况下让嵌套的知道外层层级name
    },
  },
  setup(props) {
    const { columns } = props;
    let parentFields = cloneDeep(props.parentFields);
    const formList = cloneDeep(props.formList);
    // 渲染
    return () => {
      if (!columns.length) {
        return;
      }
      return columns.map((column) => {
        if (column.hideInForm) {
          return;
        }
        let renderDom = null;
        switch (column.controlType) {
          case formControlEnum.group: {
            renderDom = column.columns && (
              <Row {...column.rowPorps}>
                <BaseFormItemWithOut
                  columns={column.columns}
                  col={true}
                  formList={props.formList}
                  parentFields={parentFields}
                ></BaseFormItemWithOut>
              </Row>
            );
            break;
          }

          case formControlEnum.formList: {
            if (formList?.dataIndex) {
              parentFields
                ? parentFields.push(formList.dataIndex)
                : (parentFields = [formList.dataIndex]);
            }
            renderDom = (
              <BaseFormFormList
                schema={column}
                index={formList?.index}
                parentFields={parentFields}
              ></BaseFormFormList>
            );
            break;
          }
          // 基础表单项
          default: {
            let name: string | [string, number, string] = column.dataIndex!;
            // 是否是formList，formList name需要调整
            if (formList) {
              name = [formList.dataIndex, formList.index, column.dataIndex!];
            }
            renderDom = (
              <FormItem
                label={column.label}
                name={name}
                {...column.formItemProps}
              >
                <BaseFormControl
                  schema={column}
                  formInfo={props.formList?.data}
                ></BaseFormControl>
              </FormItem>
            );
            break;
          }
        }
        if (props.col) {
          return <Col {...column.colProps}>{renderDom}</Col>;
        }
        return renderDom;
      });
    };
  },
});
/**
 * @description: 这个是整个form的容器组件
 * @param {schemaFormType[]} schemas 这个是用来接受schema配置
 * @param {Record<string, any>} model 这个是表单数据，要求是响应式的，以实现数据的双向绑定
 * @return {*}
 */
export default defineComponent({
  props: {
    schemas: {
      type: Array as PropType<schemaFormType[]>,
      required: true,
    },
    model: {
      type: Object as PropType<Record<string, any>>,
      required: true,
    },
  },
  setup(props, { attrs, slots, expose }) {
    // 获取传递的表单数据
    const formData = toRef(props, "model");
    // 向下传递formData数据
    provide("formData", formData);
    // 向下传递插槽
    provide("slots", slots);
    // 最终渲染
    return () => {
      return (
        <Form
          {...props}
          {...attrs}
          ref={(el) => {
            expose({
              ...el,
            });
          }}
        >
          <BaseFormItemWithOut columns={props.schemas}></BaseFormItemWithOut>
        </Form>
      );
    };
  },
});
