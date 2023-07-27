## schema-form

一个基于 ant design vue 组件库的 schema 配置表单组件，能够颗粒化更新，性能优化

## 优点

最大程度保留了组件库的 API，能够快速上手，和 ant design vue 表单项互通

## schema 说明

dataIndex?: string; 字段名称，唯一标识符，渲染表单项的 field <br />
controlType: formControlType | string; 渲染表单项的表单组件名称、如果内部不存在的话会抛出错误 <br />
label?: string; formItem 的 label <br />
formItemProps?: FormItemProps; formItem 的所有 props 对应 ant design vue 的 formItemProps 会自动注入<br />
controlRenderPops?: any; 渲染表单项的 props<br />
renderFormItem?: () => VNode | VNode[]; 当在 JSX 　情况下可以自行定义渲染<br />
hideInForm?: boolean;　在表单中是否显示<br />
rowPorps?: RowProps;　当在 group 模式下时，可以通过 rowprops 进行随意组合，会自动在外层加入 row 包裹<br />
colProps?: ColProps; 当在 group 模式下时，可以设置每一项的 col props<br />
formListProps?: { <br />
spaceProps?: SpaceProps; 外部 space 包裹<br />
addButtonProps?: ButtonProps & { text?: string }; 添加按钮的 props<br />
delButtonProps?: ButtonProps & { text?: string }; 删除按钮的 props<br />
addButtonSlot?: string; 添加按钮 插槽<br />
delButtonSlot?: string; 删除按钮 插槽<br />
}; 当是 formList 时的渲染方式的参数<br />
slot?: string; 表单项的插槽<br />

## controlType 内置表单项

Input<br />
InputGroup<br />
InputSearch<br />
InputNumber <br />
InputPassword <br />
TextArea<br />
AutoComplete <br />
Radio <br />
RadioGroup <br />
Checkbox <br />
CheckboxGroup <br />
Select <br />
Cascader <br />
DatePicker<br />
RangePicker <br />
Mentions <br />
Rate <br />
Slider<br />
Switch <br />
TimePicker <br />
TimeRangePicker <br />
Transfer<br />
TreeSelect <br />
Upload <br />
group <br />
formList <br />

## 使用示例

```html
<script setup lang="ts">
  import { reactive, ref } from "vue";
  import { Input, Button, FormInstance, Upload } from "ant-design-vue";
  import BaseForm from "./package/schemaForm/BaseForm.tsx";
  import { schemaFormType } from "./package/schemaForm/types/form";
  const formRef = ref<FormInstance>();
  const columns: schemaFormType[] = [
    {
      dataIndex: "name1",
      controlType: "Input",
      formItemProps: {
        label: "name1",
        rules: [{ required: true, message: "请输入name1" }],
      },
    },
    {
      dataIndex: "name2",
      controlType: "Input",
      formItemProps: {
        label: "name2",
        rules: [{ required: true, message: "请输入name2" }],
      },
    },
    {
      dataIndex: "select1",
      controlType: "Select",
      formItemProps: {
        label: "select1",
        rules: [{ required: true, message: "请输入name2" }],
      },
      controlRenderPops: {
        options: [
          { label: "测试1", value: "1" },
          { label: "测试2", value: "2" },
        ],
        allowClear: true,
      },
    },
    {
      controlType: "group",
      columns: [
        {
          dataIndex: "group1",
          controlType: "Input",
          formItemProps: {
            label: "group1",
          },
          controlRenderPops: {
            placeholder: "请输入group1",
          },
          colProps: {
            span: 8,
          },
        },
        {
          controlType: "group",
          columns: [
            {
              dataIndex: "group1-group1",
              controlType: "Input",
              formItemProps: {
                label: "group1-group1",
              },
              colProps: {
                span: 12,
              },
            },
            {
              dataIndex: "group1-group2",
              controlType: "Input",
              formItemProps: {
                label: "group1-group2",
              },
              colProps: {
                span: 11,
                offset: 1,
              },
            },
          ],
          colProps: {
            span: 14,
            offset: 2,
          },
        },
      ],
    },
    {
      dataIndex: "formList",
      controlType: "formList",
      formListProps: {
        addButtonProps: {
          block: true,
          text: "Add",
        },
      },
      columns: [
        {
          dataIndex: "formList2",
          controlType: "Input",
          formItemProps: {
            label: "formList2",
            rules: [{ required: true, message: "请输入formList2" }],
          },
        },
        {
          dataIndex: "formList1",
          controlType: "Input",
          formItemProps: {
            label: "formList1",
            rules: [{ required: true, message: "请输入formList1" }],
          },
        },
      ],
    },
    {
      dataIndex: "uploda",
      controlType: "Upload",
      formItemProps: {
        label: "文件",
        // rules: [{ required: true, message: "请上传文件" }],
      },
      slot: "uploadFile",
    },
    {
      dataIndex: "transfer",
      controlType: "Transfer",
      label: "transfer",
      controlRenderPops: {},
    },
    {
      dataIndex: "radio",
      controlType: "RadioGroup",
      label: "radio",
      controlRenderPops: {
        options: [
          {
            label: "radio1",
            value: 1,
          },
          {
            label: "radio2",
            value: 2,
          },
          {
            label: "radio3",
            value: 3,
            disabled: true,
          },
        ],
      },
    },
    {
      dataIndex: "checkbox",
      controlType: "CheckboxGroup",
      label: "checkbox",
      controlRenderPops: {
        options: [
          {
            label: "radio1",
            value: 1,
          },
          {
            label: "radio2",
            value: 2,
          },
          {
            label: "radio3",
            value: 3,
            disabled: true,
          },
        ],
      },
    },
    {
      dataIndex: "treeSelect",
      controlType: "TreeSelect",
      label: "treeselect",
      controlRenderPops: {
        allowClear: true,
        placeholder: "请输入",
        treeData: [
          {
            label: "Node1",
            value: "0-0",
            children: [
              {
                label: "Child Node1",
                value: "0-0-0",
              },
            ],
          },
          {
            label: "Node2",
            value: "0-1",

            children: [
              {
                label: "Child Node3",
                value: "0-1-0",
                disabled: true,
              },
              {
                label: "Child Node4",
                value: "0-1-1",
              },
              {
                label: "Child Node5",
                value: "0-1-2",
              },
            ],
          },
        ],
      },
    },
  ];
  const modelForm = reactive({
    name1: "name1",
    name2: "name2",
    name3: "name3",
    formList: [
      {
        list1: "list1",
        list2: "list2",
        list3: [
          {
            list6: "list6",
          },
        ],
      },
    ],
  });
  const handleSubmit = () => {
    formRef.value?.validate();
    console.log(modelForm);
    console.log(formRef.value?.getFieldsValue());
  };
</script>

<template>
  <div class="container">
    <BaseForm :model="modelForm" :schemas="columns" ref="formRef">
      <template #name3Slot="{ schema }">
        <input
          :disabled="modelForm.name2 === 'nanme2'"
          v-bind="schema.controlRenderPops"
          v-model:value="modelForm.name3"
        />
      </template>
      <template #uploadFile="{ schema }">
        <Upload>
          <button>点击文件上传</button>
        </Upload>
      </template>
    </BaseForm>
    <button @click="handleSubmit">提交</button>
  </div>
</template>

<style lang="less" scoped>
  .container {
    width: 600px;
    margin: 0 auto;
  }
</style>
```

## 示例渲染结果

![表单渲染结果](https://github.com/hulong-prong/schema-form-vue3/blob/master/src/assets/image.png)
