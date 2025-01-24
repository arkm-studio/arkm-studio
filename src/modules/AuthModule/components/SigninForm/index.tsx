"use client";

import { Formik, Form } from "formik";
import classNames from "classnames/bind";
import { Loader, AlertCircle } from "lucide-react";
import { TextField } from "@/components/TextField/TextField";
import { Button } from "@/components/Button";
import { GoogleButton } from "@/components/GoogleButton";
import { useSignInForm } from "../../hooks/useSignInForm";
import { SignInDictionary } from "@/types/dictionary/signin.types";
import { getIconComponent } from "@/utils/iconUtils";
import Typography from "@/components/Typography";
import styles from "./SigninForm.module.scss";

const cx = classNames.bind(styles);

interface SigninFormProps {
  className?: string;
  dictionary: SignInDictionary;
}

export function SigninForm({ className, dictionary }: SigninFormProps) {
  const { isLoading, error, validationSchema, handleSubmit } = useSignInForm(
    dictionary.form.validation
  );

  return (
    <div className={cx("signin-form", className)}>
      <Typography
        variant="h2"
        theme={{ type: "dark" }}
        className={cx("signin-form__title")}
      >
        {dictionary.header.title}
      </Typography>
      <Typography
        variant="p1"
        fontWeight={400}
        theme={{ type: "dark" }}
        className={cx("signin-form__subtitle")}
      >
        {dictionary.header.subtitle}
      </Typography>

      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnMount={true}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {({ isValid, isSubmitting }) => (
          <Form className={cx("signin-form__container")}>
            {error && (
              <div className={cx("signin-form__error")}>
                <AlertCircle size={16} />
                <Typography as="span" color="error" variant="p2">
                  {error}
                </Typography>
              </div>
            )}

            <TextField
              name="email"
              theme={{ type: "dark" }}
              label={dictionary.form.fields.email.label}
              type="email"
              icon={getIconComponent(dictionary.form.fields.email.icon)}
              placeholder={dictionary.form.fields.email.placeholder}
              variant="secondary"
              className={cx("signin-form__text-field")}
              showError
            />

            <TextField
              name="password"
              theme={{ type: "dark" }}
              label={dictionary.form.fields.password.label}
              type="password"
              placeholder={dictionary.form.fields.password.placeholder}
              variant="secondary"
              className={cx("signin-form__password-field")}
              showError
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              radius="md"
              fullWidth
              disabled={isLoading || !isValid || isSubmitting}
              className={cx("signin-form__submit")}
            >
              {isLoading ? (
                <Loader className={cx("signin-form__spinner")} size={20} />
              ) : (
                dictionary.form.buttons.primary.label
              )}
            </Button>

            <div className={cx("signin-form__separator")}>
              <Typography as="span" color="secondary" theme={{ type: "dark" }}>
                {dictionary.form.buttons.separator.text}
              </Typography>
            </div>

            <GoogleButton
              variant="outline"
              size="md"
              radius="md"
              className={cx("signin-form__google-button")}
            >
              <Typography variant="p1" theme={{ type: "dark" }}>
                {dictionary.form.buttons.google.label}
              </Typography>
            </GoogleButton>

            <Typography
              variant="p3"
              theme={{ type: "dark" }}
              className={cx("signin-form__note")}
            >
              {dictionary.form.note}
            </Typography>
          </Form>
        )}
      </Formik>
    </div>
  );
}
