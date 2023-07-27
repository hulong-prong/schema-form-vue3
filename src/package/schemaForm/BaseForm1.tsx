import { Form, Row, Col, FormItem, Space, Button } from "ant-design-vue";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons-vue";
import { PropType, defineComponent, renderSlot, toRef } from "vue";
import { formControlEnum, schemaFormType } from "./types/form";
import { componentMap } from "./types/data";

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
    /**
     * @description: 根据每一项schema渲染表单
     * @param {schemaFormType} schema
     * @param {Record<string, any>} formInfo
     * @return {*}
     */
    const getRenderControlForm = (
      schema: schemaFormType,
      formInfo?: Record<string, any>
    ) => {
      if (schema.hideInForm) {
        return;
      }
      if (schema.renderFormItem) {
        return schema.renderFormItem;
      }
      const targetFormData = formInfo
        ? formInfo[schema.dataIndex!]
        : formData.value[schema.dataIndex!];
      // 判断是否自定义了插槽，有直接渲染插槽
      if (slots && schema.slot && Reflect.has(slots, schema.slot)) {
        return renderSlot(slots, schema.slot, {
          schema: schema,
          data: targetFormData,
        });
      }
      const ItemDom = componentMap.get(schema.controlType);
      if (!ItemDom) {
        throw Error(`${schema.controlType}: 不在渲染组件中`);
      }
      // formList 时双向绑定的数据
      if (!formInfo) {
        return (
          ItemDom && (
            <ItemDom
              {...schema.controlRenderPops}
              v-model:value={formData.value[schema.dataIndex!]}
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
    /**
     * @description: 当渲染项为formList 时的渲染方式
     * @param {Number} index  深层嵌套时的index
     * @param {string[]} parentFields 父级的
     * @return {*}
     */
    function renderFormList(
      schema: schemaFormType,
      index?: number,
      parentFields?: string[]
    ) {
      if (schema.hideInForm) {
        return;
      }
      // 需要有dataindex
      if (schema.dataIndex) {
        let mapData = formData.value?.[schema.dataIndex] as any[];
        // 嵌套时的数据
        if (parentFields) {
          const middle = parentFields.reduce((obj, key) => {
            return obj[key];
          }, formData.value);
          if (index !== undefined) {
            mapData = middle[index][schema.dataIndex];
          }
        }
        /**
         * @description: 添加一行
         * @return {*}
         */
        const addFormList = () => {
          // 无初始值时
          if (!mapData) {
            mapData = [];
            // 嵌套
            if (parentFields) {
              let currentObj = formData.value;
              // 遍历设置每一项的数据
              parentFields.forEach((field) => {
                if (!currentObj[field]) {
                  currentObj[field] = {};
                }
                currentObj = currentObj[field];
              });
              // 反向绑定数据到formData，供外部使用
              if (schema.dataIndex && index !== undefined) {
                currentObj[index][schema.dataIndex!] = mapData;
              }
            } else {
              // 把值回填用于重新渲染
              if (schema.dataIndex) {
                formData.value[schema.dataIndex!] = mapData;
              }
            }
          }
          // 追加一项
          mapData.push({});
        };
        /**
         * @description: 删除一行
         * @param {number} index
         * @return {*}
         */
        const delFormList = (index: number) => {
          mapData.splice(index, 1);
        };
        // 添加按钮
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
        return (
          <>
            {mapData &&
              mapData.map((el, index) => {
                return (
                  <Space
                    key={el}
                    align="baseline"
                    {...schema.formListProps?.spaceProps}
                  >
                    {schema.columns &&
                      renderFormItemFun(
                        schema.columns,
                        false,
                        {
                          data: el,
                          index,
                          dataIndex: schema.dataIndex!,
                        },
                        parentFields
                      )}
                    {delButtonDom(el, index)}
                  </Space>
                );
              })}
            {addButtonDom}
          </>
        );
      }
      throw Error("外层formList 请设置dataIndex 否则不知道谁需要收集数据");
    }

    /**
     * @description: 外层容器渲染方法
     * @param {schemaFormType[]} columns 渲染的schema
     * @param {boolean} col 是否需要外层嵌套col
     * @param {*} formList 列表渲染时的目标数据
     * @param {string[]}parentFields 当存在嵌套formList 时启用，当前通过form.getFileds获取的表单数据有问题
     * @return {*}
     */
    const renderFormItemFun = (
      columns: schemaFormType[],
      col: boolean = false,
      formList?: {
        data: Record<string, any>;
        index: number;
        dataIndex: string;
      },
      parentFields?: string[]
    ) => {
      // 无数据直接返回
      if (!columns?.length) {
        return null;
      }
      return columns.map((column) => {
        if (column.hideInForm) {
          return;
        }
        switch (column.controlType) {
          case formControlEnum.group: {
            return (
              column.columns && (
                <Row {...column.rowPorps}>
                  {renderFormItemFun(
                    column.columns,
                    true,
                    formList,
                    parentFields
                  )}
                </Row>
              )
            );
          }

          case formControlEnum.formList: {
            if (formList?.dataIndex) {
              parentFields
                ? parentFields.push(formList.dataIndex)
                : (parentFields = [formList.dataIndex]);
            }
            return renderFormList(column, formList?.index, parentFields);
          }
          // 基础表单项
          default: {
            let name: string | [string, number, string] = column.dataIndex!;
            // 是否是formList，formList name需要调整
            if (formList) {
              name = [formList.dataIndex, formList.index, column.dataIndex!];
            }
            const dom = (
              <FormItem
                label={column.label}
                name={name}
                {...column.formItemProps}
              >
                {getRenderControlForm(column, formList?.data)}
              </FormItem>
            );
            // 当为group 需要嵌套col
            if (col) {
              return <Col {...column.colProps}>{dom}</Col>;
            }
            return dom;
          }
        }
      });
    };
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
          {renderFormItemFun(props.schemas)}
        </Form>
      );
    };
  },
});
