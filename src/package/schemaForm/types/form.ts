import type {
  AutoCompleteProps,
  InputNumberProps,
  InputProps,
  RadioProps,
  SelectProps,
  CascaderProps,
  DatePickerProps,
  MentionsProps,
  RateProps,
  SliderProps,
  SwitchProps,
  TimePickerProps,
  TransferProps,
  TreeSelectProps,
  UploadProps,
  CheckboxProps,
  TextAreaProps,
  FormItemProps,
  RowProps,
  ColProps,
  SpaceProps,
  ButtonProps,
} from "ant-design-vue";
import type { VNode } from "vue";

export enum formControlEnum {
  Input = "Input",
  InputGroup = "InputGroup",
  InputSearch = "InputSearch",
  InputNumber = "InputNumber",
  InputPassword = "InputPassword",
  TextArea = "TextArea",
  AutoComplete = "AutoComplete",
  Radio = "Radio",
  RadioGroup = "RadioGroup",
  Checkbox = "Checkbox",
  CheckboxGroup = "CheckboxGroup",
  Select = "Select",
  Cascader = "Cascader",
  DatePicker = "DatePicker",
  RangePicker = "RangePicker",
  Mentions = "Mentions",
  Rate = "Rate",
  Slider = "Slider",
  Switch = "Switch",
  TimePicker = "TimePicker",
  TimeRangePicker = "TimeRangePicker",
  Transfer = "Transfer",
  TreeSelect = "TreeSelect",
  Upload = "Upload",
  group = "group",
  formList = "formList",
}

/**
 * @description: 每个表单控件对应的props类型
 * @return {*}
 */
export type formControlTypeProps = {
  [formControlEnum.Input]: () => InputProps;
  [formControlEnum.InputGroup]: () => InputProps;
  [formControlEnum.InputSearch]: () => InputProps;
  [formControlEnum.InputNumber]: () => InputNumberProps;
  [formControlEnum.InputPassword]: () => InputProps;
  [formControlEnum.TextArea]: () => TextAreaProps;
  [formControlEnum.AutoComplete]: () => AutoCompleteProps;
  [formControlEnum.Radio]: () => RadioProps;
  [formControlEnum.RadioGroup]: () => RadioProps;
  [formControlEnum.Checkbox]: () => CheckboxProps;
  [formControlEnum.CheckboxGroup]: () => CheckboxProps;
  [formControlEnum.Select]: () => SelectProps;
  [formControlEnum.Cascader]: () => CascaderProps;
  [formControlEnum.DatePicker]: () => DatePickerProps;
  [formControlEnum.RangePicker]: () => DatePickerProps;
  [formControlEnum.Mentions]: () => MentionsProps;
  [formControlEnum.Rate]: () => RateProps;
  [formControlEnum.Slider]: () => SliderProps;
  [formControlEnum.Switch]: () => SwitchProps;
  [formControlEnum.TimePicker]: () => TimePickerProps;
  [formControlEnum.TimeRangePicker]: () => TimePickerProps;
  [formControlEnum.Transfer]: () => TransferProps;
  [formControlEnum.TreeSelect]: () => TreeSelectProps;
  [formControlEnum.Upload]: () => UploadProps;
  [formControlEnum.group]: () => any; // 一组，当需要多个控件在一行的时候启用这个
  [formControlEnum.formList]: () => any; // 当这个字段是一个 array的时候
};
// 根据函数返回值推断类型
type ReturnTypeFormFun<T, K extends keyof T> = T[K] extends () => infer R
  ? R
  : never;
/**
 * @description: 得到所有的表单控件类型
 * @return {*}
 */
export type formControlType = Extract<keyof formControlTypeProps, any>;

/**
 * @description: schema的基础类型
 * @return {*}
 */
export type schemaBaseType = {
  dataIndex?: string;
  controlType: formControlType | string;
  label?: string;
  formItemProps?: FormItemProps;
  controlRenderPops?: any;
  renderFormItem?: () => VNode | VNode[];
  hideInForm?: boolean;
  rowPorps?: RowProps;
  colProps?: ColProps;
  formListProps?: {
    spaceProps?: SpaceProps;
    addButtonProps?: ButtonProps & { text?: string };
    delButtonProps?: ButtonProps & { text?: string };
    addButtonSlot?: string;
    delButtonSlot?: string;
  };
  slot?: string;
};

/**
 * @description: 表单项数据
 * @return {*}
 */
export type schemaFormType = schemaBaseType & {
  columns?: schemaFormType[];
};
