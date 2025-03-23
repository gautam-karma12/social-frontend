import React from "react";
import { Layout, Typography, Space, Button, Dropdown, Avatar } from "antd";
import { PlusOutlined, UserOutlined } from "@ant-design/icons";

const { Header } = Layout;
const { Title } = Typography;

const CommonHeader = ({ onCreatePost, menu }) => {
	return (
		<Header
			style={{
				background: "#1890ff",
				color: "#fff",
				display: "flex",
				justifyContent: "space-between",
				padding: "0 50px",
			}}
		>
			<Title level={3} style={{ color: "#fff", margin: 14 }}>
				Social Media App
			</Title>

			<Space>
				<Button type="primary" icon={<PlusOutlined />} onClick={onCreatePost}>
					Create Post
				</Button>

				<Dropdown overlay={menu} trigger={["click"]}>
					<Avatar
						size="large"
						icon={<UserOutlined />}
						style={{ cursor: "pointer" }}
					/>
				</Dropdown>
			</Space>
		</Header>
	);
};

export default CommonHeader;
