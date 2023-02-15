import { directive } from '../core/provider';

directive('*model', () => {
  return {
    newContext: false,
    apply(el, context, exp: string) {
      const isCheckbox =
        el instanceof HTMLInputElement && el.type === 'checkbox';
      const eventName =
        el instanceof HTMLSelectElement || isCheckbox ? 'change' : 'input';
      const setModelValue = (value: any) => {
        context.$set(exp, value);
        context.$notify();
      };
      const getModelValue = () => context.$eval(exp);
      const getElValue = () => (isCheckbox ? el.checked : (el as any).value);
      const setElValue = (value: any) => {
        if (isCheckbox) {
          el.checked = value;
        } else {
          (el as any).value = value;
        }
      };

      if (!isCheckbox && getElValue() !== '') {
        setModelValue(getElValue());
      } else {
        setElValue(getModelValue());
      }

      el.addEventListener(eventName, () => setModelValue(getElValue()));

      context.$watch(exp, setElValue);
    },
  };
});
