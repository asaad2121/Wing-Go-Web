import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import React from "react";
import { Controller, useForm } from "react-hook-form";

type FormFieldsProps = {
  formFields: object | any;
  onSubmit: Function | any;
  onError: Function | any;
};

const FormFields: React.FC<FormFieldsProps> = ({
  formFields,
  onSubmit,
  onError,
}) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    trigger,
  } = useForm();

  return (
    <form action="#" onSubmit={handleSubmit(onSubmit, onError)}>
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        {formFields.map((field: any, i: number) => (
          <Controller
            key={i}
            name={field.name}
            control={control}
            rules={{
              required: "This field is required.",
              pattern: {
                value: new RegExp(field.regex),
                message: field.regex_message,
              },
            }}
            render={({ field: { onChange, value } }) => {
              return (
                <Box mb={2} key={i}>
                  <FormControl
                    sx={{ m: 1, width: "25ch" }}
                    variant="outlined"
                    key={i}
                  >
                    <InputLabel htmlFor={field.name}>{field.label}</InputLabel>
                    <OutlinedInput
                      key={i}
                      id={field.name}
                      type={field.type}
                      value={value}
                      error={Boolean(errors[field.name])}
                      fullWidth
                      required
                      onChange={(e) => {
                        if (trigger) trigger(field.name);
                        onChange(e.target.value);
                      }}
                      endAdornment={field.endAdornment}
                      label={field.label}
                    />
                  </FormControl>
                  {errors[field.name] && (
                    <FormHelperText>
                      {errors[field.name]?.message?.toString()}
                    </FormHelperText>
                  )}
                </Box>
              );
            }}
          />
        ))}
        <Box mt={2}>
          <Button
            variant="outlined"
            type="submit"
            disabled={Boolean(errors.length)}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </form>
  );
};
export default FormFields;
