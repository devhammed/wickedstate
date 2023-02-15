import { directive } from '../core/provider';

directive('*model', () => {
  return {
    newContext: false,
    apply(el, context, exp) {
      const isCheckboxOrRadio =
        el instanceof HTMLInputElement &&
        ['checkbox', 'radio'].indexOf(el.type) > -1;
      const eventName =
        el instanceof HTMLSelectElement || isCheckboxOrRadio
          ? 'change'
          : 'input';
      const setModelValue = (value: any) => {
        context.$set(exp, value);
        context.$notify();
      };
      const getModelValue = () => context.$eval(exp);
      const getElValue = () => {
        if (isCheckboxOrRadio) {
          return el.type === 'checkbox' ? el.checked : el.value;
        }

        if (el instanceof HTMLSelectElement && el.multiple) {
          return [].slice
            .call(el.selectedOptions)
            .map((option: HTMLOptionElement) => option.value || option.text);
        }

        return (el as any).value;
      };
      const setElValue = (value: any) => {
        if (isCheckboxOrRadio) {
          el.checked = value;
          return;
        }

        if (el instanceof HTMLSelectElement && el.multiple) {
          el.selectedIndex = 0;

          [].slice.call(el.options).forEach((option: HTMLOptionElement) => {
            if (value.indexOf(option.value || option.text) > -1) {
              option.selected = true;
            } else {
              option.selected = false;
            }
          });

          return;
        }

        (el as any).value = value;
      };

      if (!isCheckboxOrRadio && getElValue() !== '') {
        setModelValue(getElValue());
      } else {
        setElValue(getModelValue());
      }

      el.addEventListener(eventName, (event) => {
        if (event instanceof CustomEvent && event.detail !== undefined) {
          setModelValue(event.detail ?? (event.target as any).value);
        } else {
          setModelValue(getElValue());
        }
      });

      context.$watch(exp, setElValue);
    },
  };
});
