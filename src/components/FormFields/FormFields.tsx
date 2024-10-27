import { Box, FormControl, FormHelperText, InputLabel, OutlinedInput } from '@mui/material';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import classes from './FormFields.module.scss';

type FormFieldsProps = {
    formFields: object | any;
    onSubmit: Function | any;
    onError: Function | any;
    submitButton?: Function | any;
};

const FormFields: React.FC<FormFieldsProps> = ({ formFields, onSubmit, onError, submitButton }) => {
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
                        key={field.id}
                        name={field.name}
                        control={control}
                        rules={{
                            required: 'This field is required.',
                            pattern: {
                                value: new RegExp(field.regex),
                                message: field.regex_message,
                            },
                        }}
                        render={({ field: { onChange, value } }) => (
                            <Box mb={2}>
                                <FormControl className={classes['wg-formFields-formControl']} key={i}>
                                    <InputLabel htmlFor={field.name} className={classes['wg-formFields-label']} shrink>
                                        {field.label}
                                    </InputLabel>
                                    <OutlinedInput
                                        id={field.id}
                                        type={field.type}
                                        value={value || field.value}
                                        error={Boolean(errors[field?.name])}
                                        className={classes['wg-formFields-inputField']}
                                        autoComplete={field.autoComplete}
                                        fullWidth
                                        required
                                        onChange={(e) => {
                                            onChange(e.target.value);
                                            if (trigger) trigger(field.name);
                                        }}
                                        onFocus={() => {
                                            if (trigger) trigger(field.name);
                                        }}
                                        endAdornment={field.endAdornment}
                                        label={field.label}
                                    />
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
                {submitButton(errors)}
            </Box>
        </form>
    );
};
export default FormFields;
