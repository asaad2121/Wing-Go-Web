import { Box, FormControl, FormHelperText, InputLabel, OutlinedInput } from '@mui/material';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import classes from './FormFields.module.scss';
import MuiPhoneNumber from 'mui-phone-number';

type FormFieldsProps = {
    formFields: object | any;
    onSubmit: Function | any;
    onError: Function | any;
    submitButton?: Function | any;
    customOnChange?: Function | any;
};

const FormFields: React.FC<FormFieldsProps> = ({ formFields, onSubmit, onError, submitButton, customOnChange }) => {
    const {
        handleSubmit,
        control,
        formState: { errors },
        trigger,
    } = useForm();

    return (
        <form onSubmit={handleSubmit(onSubmit, onError)}>
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                {formFields.map((field: any, i: number) => (
                    <Controller
                        key={i}
                        name={field?.name}
                        control={control}
                        // TO-DO: Check the validation error problems for type 'tel'
                        rules={
                            field?.type === 'tel'
                                ? {}
                                : {
                                      pattern: {
                                          value: new RegExp(field?.regex),
                                          message: field?.regex_message,
                                      },
                                  }
                        }
                        render={({ field: { onChange, value } }) => (
                            <Box mb={3}>
                                <FormControl className={classes['wg-formFields-formControl']} key={i}>
                                    <InputLabel htmlFor={field?.name} className={classes['wg-formFields-label']} shrink>
                                        {field?.label}
                                    </InputLabel>
                                    {field?.type === 'tel' && (
                                        <MuiPhoneNumber
                                            defaultCountry="nz"
                                            className={classes['wg-formFields-phoneField']}
                                            value={value || field?.value}
                                            disabled={field?.disabled}
                                            required={field?.required}
                                            onChange={(e) => {
                                                onChange(e);
                                                console.log(field?.name, e);
                                                customOnChange && customOnChange(field?.name, e);
                                                if (trigger) trigger(field?.name);
                                            }}
                                        />
                                    )}
                                    {field?.type !== 'tel' && (
                                        <OutlinedInput
                                            id={field?.id}
                                            type={field?.type}
                                            value={value || field?.value}
                                            error={Boolean(errors[field?.name])}
                                            className={classes['wg-formFields-inputField']}
                                            autoComplete={field?.autoComplete}
                                            disabled={field?.disabled}
                                            fullWidth
                                            required={field?.required}
                                            onChange={(e) => {
                                                onChange(e.target.value);
                                                customOnChange && customOnChange(field?.name, e.target.value);
                                                if (trigger) trigger(field?.name);
                                            }}
                                            onFocus={() => {
                                                if (trigger) trigger(field?.name);
                                            }}
                                            endAdornment={field?.endAdornment}
                                            label={field?.label}
                                        />
                                    )}
                                </FormControl>
                                {errors[field?.name] && (
                                    <FormHelperText className={classes['wg-formFields-helperText']}>
                                        {errors[field?.name]?.message?.toString()}
                                    </FormHelperText>
                                )}
                            </Box>
                        )}
                    />
                ))}
                {submitButton && submitButton(errors)}
            </Box>
        </form>
    );
};
export default FormFields;
