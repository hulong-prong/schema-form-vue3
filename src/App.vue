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
        <Input
          :disabled="modelForm.name2 === 'nanme2'"
          v-bind="schema.controlRenderPops"
          v-model:value="modelForm.name3"
        />
      </template>
      <template #uploadFile="{ schema }">
        <Upload>
          <Button>点击文件上传</Button>
        </Upload>
      </template>
    </BaseForm>
    <Button @click="handleSubmit">提交</Button>
  </div>
</template>

<style lang="less" scoped>
.container {
  width: 600px;
  margin: 0 auto;
}
</style>
