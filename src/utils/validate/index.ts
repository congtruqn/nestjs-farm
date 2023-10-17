import { ValidatorOptions, validate } from 'class-validator';

interface IValidateCustom {
  key: string;
  errorMessage: string;
}

export const validateCustom = async (
  object: object,
  validatorOptions?: ValidatorOptions,
) => {
  const errors: IValidateCustom[] = [];

  const error = await validate(object, validatorOptions);
  error.forEach((error) => {
    errors.push({
      key: error.property,
      errorMessage: Object.values(error.constraints)[0],
    });
  });

  return errors;
};
