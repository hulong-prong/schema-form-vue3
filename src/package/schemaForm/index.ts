import BaseForm from "./BaseForm.tsx";
import { App, Component } from "vue";
import { schemaFormType } from "./types/form.ts";

BaseForm.install = (app: App) => {
  app.component("BaseForm", BaseForm);
};
const BaseFormVue: Component = BaseForm;

export default BaseFormVue;
export type schemaType = schemaFormType;
