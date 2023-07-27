import type { Component } from "vue";

/**
 * Component list, register here to setting it in the form
 */
import {
  Input,
  Select,
  Radio,
  Checkbox,
  AutoComplete,
  Cascader,
  DatePicker,
  InputNumber,
  Switch,
  TimePicker,
  TreeSelect,
  Slider,
  Rate,
  Upload,
  Mentions,
  Transfer,
  TimeRangePicker,
  RangePicker,
} from "ant-design-vue";
import { formControlEnum } from "./form";

const componentMap = new Map<formControlEnum | string, Component>();

componentMap.set(formControlEnum.Input, Input);
componentMap.set(formControlEnum.InputGroup, Input.Group);
componentMap.set(formControlEnum.InputPassword, Input.Password);
componentMap.set(formControlEnum.InputSearch, Input.Search);
componentMap.set(formControlEnum.TextArea, Input.TextArea);
componentMap.set(formControlEnum.InputNumber, InputNumber);
componentMap.set(formControlEnum.AutoComplete, AutoComplete);

componentMap.set(formControlEnum.Select, Select);
componentMap.set(formControlEnum.TreeSelect, TreeSelect);
componentMap.set(formControlEnum.Switch, Switch);
componentMap.set(formControlEnum.Radio, Radio);
componentMap.set(formControlEnum.RadioGroup, Radio.Group);
componentMap.set(formControlEnum.Checkbox, Checkbox);
componentMap.set(formControlEnum.CheckboxGroup, Checkbox.Group);
componentMap.set(formControlEnum.Cascader, Cascader);
componentMap.set(formControlEnum.Slider, Slider);
componentMap.set(formControlEnum.Rate, Rate);
componentMap.set(formControlEnum.Transfer, Transfer);

componentMap.set(formControlEnum.DatePicker, DatePicker);
componentMap.set(formControlEnum.RangePicker, RangePicker);
componentMap.set(formControlEnum.TimePicker, TimePicker);
componentMap.set(formControlEnum.TimeRangePicker, TimeRangePicker);

componentMap.set(formControlEnum.Mentions, Mentions);

componentMap.set(formControlEnum.Upload, Upload);

export { componentMap };
