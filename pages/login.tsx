import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import React from "react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { logIn } from "@/redux/features/auth-slice";
import { useStoreSelector, useAppDispatch } from "@/redux/store";
const isProd = process.env.REACT_APP_ENV === "prod";
console.log(isProd, process.env.REACT_APP_ENV);

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const { user_email, user_password } = useStoreSelector(
    (state) => state.authReducer.value
  );

  const {
    handleSubmit,
    control,
    formState: { errors },
    trigger,
  } = useForm();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const formFields = [
    {
      name: "user_email",
      label: "Email Address",
      type: isProd ? "email" : "text",
      regex: isProd
        ? `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$`
        : "",
      regex_message: "Invalid email",
      endAdornment: null,
    },
    {
      name: "user_password",
      label: "Password",
      type: showPassword ? "text" : "password",
      regex: isProd
        ? `^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{7,}$`
        : "",
      regex_message: "Invalid password",
      endAdornment: (
        <InputAdornment position="end">
          <IconButton
            aria-label="toggle password visibility"
            onClick={handleClickShowPassword}
            onMouseDown={handleMouseDownPassword}
            edge="end"
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      ),
    },
  ];

  const submitData = (formData: any, event: any) => {
    console.log("SUBMITTED", formData);
    dispatch(logIn(formData));
  };

  const onErrors = (formData: any, event: any) => {
    console.log("ERROR", formData);
  };

  return (
    <>
      <form action="#" onSubmit={handleSubmit(submitData, onErrors)}>
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          sx={{ marginLeft: "40%", marginRight: "40%", marginTop: "10%" }}
        >
          <Box mb={2}>
            {/* Showing User State, HIDE LATER */}
            {!isProd && (
              <>
                {user_email && <h5>User Email: {user_email}</h5>}
                {user_password && <h5>User Password: {user_password}</h5>}
              </>
            )}
            {formFields.map((field, i) => (
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
                        <InputLabel htmlFor={field.name}>
                          {field.label}
                        </InputLabel>
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
          </Box>
          <Button
            variant="outlined"
            type="submit"
            disabled={Boolean(errors.length)}
          >
            Submit
          </Button>
        </Box>
      </form>
    </>
  );
};

export default Login;
