import { ErrorMessage, Field, Form, Formik } from "formik";
import React from "react";
import { Link } from "react-router-dom";
import * as Yup from "yup";

export default function SignUpForm({ onSubmit }) {
	const initialValues = {
		username : "",
		email: "",
		password: "",
	};
	const validationSchema = Yup.object({
		username: Yup.string().required("User Name is required"),
		email: Yup.string()
			.email("Invalid email format")
			.required("Email is required"),
		password: Yup.string()
			.min(6, "Password must be at least 6 characters")
			.max(12, "Password must be at Most 12 characters")
			.required("Password is required"),
	});

	return (
		<div className="container mt-5">
			<div className="row justify-content-center">
				<div className="col-md-6">
					<div className="card">
						<div className="card-body">
							<Formik
								initialValues={initialValues}
								validationSchema={validationSchema}
								onSubmit={onSubmit}
							>
								{({ isSubmitting }) => (
									<Form>
										<div className="form-group">
											<label htmlFor="username">User Name</label>
											<Field
												type="username"
												className="form-control"
												id="username"
												name="username"
												placeholder="User Name"
											/>
											<ErrorMessage
												name="username"
												component="div"
												className="text-danger"
											/>
										</div>
										<div className="form-group">
											<label htmlFor="email">Email</label>
											<Field
												type="email"
												className="form-control"
												id="email"
												name="email"
												placeholder="Email"
											/>
											<ErrorMessage
												name="email"
												component="div"
												className="text-danger"
											/>
										</div>
										<div className="form-group">
											<label htmlFor="password">Password</label>
											<Field
												type="password"
												className="form-control"
												id="password"
												name="password"
												placeholder="Password"
											/>
											<ErrorMessage
												name="password"
												component="div"
												className="text-danger"
											/>
										</div>
										<button
											type="submit"
											className="btn btn-danger"
											disabled={isSubmitting}
										>
											Sign Up
										</button>
									</Form>
								)}
							</Formik>
							<p className="mt-3">
								Not registered? <Link to="/sign-up">Create an account</Link>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
