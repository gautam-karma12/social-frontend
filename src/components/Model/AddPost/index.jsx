import { useState } from "react";
import { Modal, Space, Input, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import {UploadImage} from "../../../services/postService"
const { TextArea } = Input;

const PostModal = ({ isModalVisible, handleCancel, handleAddPost }) => {
	const [file, setFile] = useState(null);

	// Form validation schema using Yup
	const validationSchema = Yup.object().shape({
		title: Yup.string().required("Title is required"),
		content: Yup.string().required("Content is required"),
		// image: Yup.mixed().required("Image is required"),
	});
	// File upload handler
	const handleUpload = async ({ file }) => {
		setFile(file.response.imageUrl);
	};

	// Form submission handler
	const onSubmit = (values, { setSubmitting }) => {
		const formData = new FormData();
		formData.append("title", values.title);
		formData.append("content", values.content);
		formData.append("image", file);
		// if (file) {
		// 	formData.append("file", file);
		// }
		handleAddPost(formData);
		setSubmitting(false);
		setFile(null);
	};

	return (
		<Modal
			title="Create New Post"
			open={isModalVisible}
			onCancel={handleCancel}
			footer={null}   // Disable default footer buttons
		>
			<Formik
				initialValues={{ title: "", content: "" }}
				validationSchema={validationSchema}
				onSubmit={onSubmit}
			>
				{({ values, handleChange, errors, touched, isSubmitting }) => (
					<Form>
						<Space direction="vertical" style={{ width: "100%" }}>
							{/* Title Field */}
							<Field
								as={Input}
								name="title"
								placeholder="Post Title"
								value={values.title}
								onChange={handleChange}
							/>
							{touched.title && errors.title && (
								<div style={{ color: "red" }}>{errors.title}</div>
							)}

							{/* Content Field */}
							<Field
								as={TextArea}
								name="content"
								rows={4}
								placeholder="What's on your mind?"
								value={values.content}
								onChange={handleChange}
							/>
							{touched.content && errors.content && (
								<div style={{ color: "red" }}>{errors.content}</div>
							)}
							<Upload
							    name='image'
								action='https://social-backend-production-4ffa.up.railway.app/api/upload-image'
								onChange={handleUpload}
								accept="image/*,video/*"
								maxCount={1}
							>
								<Button icon={<UploadOutlined />}>Upload Image/Video</Button>
							</Upload>

							<div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
								<Button onClick={handleCancel}>Cancel</Button>
								<Button
									type="primary"
									htmlType="submit"
									loading={isSubmitting}
								>
									Post
								</Button>
							</div>
						</Space>
					</Form>
				)}
			</Formik>
		</Modal>
	);
};

export default PostModal;
