import { useCallback } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { forgotPasswordSchema } from "../schema/authschema";
import { useAuth } from "../context/Authcontext";
import logo from "../assets/Imgaes/Logo.jpg";

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none " +
  "focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20";

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const navigate = useNavigate("")
  const handleSubmit = useCallback(
    async (values, { setSubmitting, resetForm }) => {
      try {
        await forgotPassword(values.email);
        resetForm();
        navigate("/admin/login")
      } finally {
        setSubmitting(false);
      }
    },
    [forgotPassword]
  );

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="h-12 sm:h-14 bg-slate-900 flex items-center px-4 sm:px-6">
        <img
          src={logo}
          alt="The Gifted Pencil"
          className="h-8 sm:h-9 w-auto object-contain rounded"
          loading="lazy"
        />
      </header>

      <main className="flex items-center justify-center px-4 py-8 sm:py-10">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="text-center mb-6">
            <img
              src={logo}
              alt="The Gifted Pencil"
              className="mx-auto w-24 sm:w-28 h-auto max-h-14 object-contain rounded"
              loading="lazy"
            />
            <h1 className="mt-3 font-bold text-slate-900 text-xl sm:text-2xl">
              Forgot Password?
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Enter your email to receive a reset link
            </p>
          </div>

          <Formik
            initialValues={{ email: "" }}
            validationSchema={forgotPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="text-xs text-red-500 mt-1"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-full bg-indigo-600 hover:bg-indigo-700 py-2.5 text-white text-sm"
                >
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </button>
              </Form>
            )}
          </Formik>

          <p className="mt-5 text-center text-sm text-slate-500">
            Remembered?{" "}
            <Link to="/admin/login" className="text-indigo-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
