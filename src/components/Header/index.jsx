import React, { useState } from "react";
import { Layout, Typography, Space, Button, Dropdown, Avatar, Menu } from "antd";
import { PlusOutlined, UserOutlined, MoreOutlined } from "@ant-design/icons";

const { Header } = Layout;
const { Title } = Typography;

const CommonHeader = ({ onCreatePost, menu }) => {
	const [visible, setVisible] = useState(false);

	// Menu for mobile dropdown
	const mobileMenu = (
		<Menu>
			<Menu.Item key="1" onClick={onCreatePost}>
				<PlusOutlined /> Create Post
			</Menu.Item>
			<Menu.Item key="2">{menu}</Menu.Item>
		</Menu>
	);

	return (
		<Header
			style={{
				background: "#1890ff",
				color: "#fff",
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				padding: "0 50px",
				position: "sticky",
				top: 0,
				zIndex: 1000,
				width: "100%",
				flexWrap: "wrap",
			}}
		>
			{/* App Title */}
			<Title
				level={3}
				style={{
					color: "#fff",
					margin: 14,
					whiteSpace: "nowrap",
					overflow: "hidden",
					textOverflow: "ellipsis",
					maxWidth: "60%",
				}}
			>
				Social Media App
			</Title>

			{/* Actions */}
			<Space>
				{/* Show "Create Post" and Profile on large screens */}
				<div className="desktop-actions">
					<Button type="primary"  icon={<PlusOutlined />} onClick={onCreatePost}>
						Create Post
					</Button>
					<Dropdown overlay={menu} trigger={["click"]} className="ml-2">
						<Avatar
							size="large"
							icon={<UserOutlined />}
							style={{ cursor: "pointer" }}
						/>
					</Dropdown>
				</div>

				{/* Show three-dot menu on small screens */}
				<div className="mobile-actions">
					<Dropdown
						overlay={mobileMenu}
						trigger={["click"]}
						onVisibleChange={(flag) => setVisible(flag)}
						visible={visible}
					>
						<Button type="text" icon={<MoreOutlined />} />
					</Dropdown>
				</div>
			</Space>

			{/* CSS for hiding elements on different screen sizes */}
			<style>
				{`
				@media (max-width: 768px) {
					.desktop-actions {
						display: none;
					}
				}
				@media (min-width: 769px) {
					.mobile-actions {
						display: none;
					}
				}
				`}
			</style>
		</Header>
	);
};

export default CommonHeader;
