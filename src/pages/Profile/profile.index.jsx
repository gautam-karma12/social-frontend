import React, { useEffect, useState } from "react";
import {
	Button,
	List,
	Card,
	Avatar,
	Typography,
	Space,
	Spin,
	Row,
	Col,
} from "antd";
import { UserOutlined, LeftOutlined } from "@ant-design/icons";
import useCustomNavigation from "../../helper/handleNavigation/index";
import { getProfileData } from "../../services/authService";
import { getOwnPost } from "../../services/postService";
const { Title, Text } = Typography;

const Profile = () => {
	const { goTo } = useCustomNavigation();
	const [user, setUser] = useState(null);
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const getuserProfile = async () => {
		try {
			const response = await getProfileData();
			setUser(response.data);
			setLoading(false);
		} catch (error) {
			console.error(error);
		}
	};
	const getOwnPosts = async () => {
		try {
			const response = await getOwnPost();
			setPosts(response.data || []);
		} catch (error) {
			console.error(error);
		}
	};
	useEffect(() => {
		getuserProfile();
		getOwnPosts();
	}, []);

	if (loading) {
		return (
			<Spin
				size="large"
				style={{ display: "flex", justifyContent: "center", marginTop: "20%" }}
			/>
		);
	}

	return (
		<div style={{ padding: "20px" }}>
			<Button
				onClick={() => goTo("/home")}
				icon={<LeftOutlined />}
				style={{ marginBottom: "20px" }}
			>
				Back to Feed
			</Button>

			<Card bordered={false} style={{ maxWidth: "900px", margin: "0 auto" }}>
				<Row align="middle" gutter={16}>
					<Col xs={24} sm={6} style={{ textAlign: "center" }}>
						<Avatar
							size={100}
							src={user?.profilePic || <UserOutlined />}
							icon={!user?.profilePic && <UserOutlined />}
						/>
					</Col>

					<Col xs={24} sm={18}>
						<Title level={3}>{user.username}</Title>
						<Text>Email: {user.email}</Text>
						<br />
						<Space size="large" style={{ marginTop: "10px" }}>
							<Text>
								Followers: <strong>{user.followers}</strong>
							</Text>
							<Text>
								Following: <strong>{user.following}</strong>
							</Text>
						</Space>
					</Col>
				</Row>
			</Card>

			<Title level={4} style={{ marginTop: "30px" }}>
				Your Posts
			</Title>

			<List
				dataSource={posts}
				renderItem={(post) => (
					<List.Item key={post.id}>
						<Card
							title={post.title}
							style={{ width: "100%" }}
							extra={
								<Text>{new Date(post.createdAt).toLocaleDateString()}</Text>
							}
						>
							<p>{post.content}</p>
							{post.image && (
								<img
									src={post.image}
									alt="Post"
									style={{
										width: "100%",
										maxHeight: "300px",
										objectFit: "cover",
									}}
								/>
							)}
						</Card>
					</List.Item>
				)}
			/>
		</div>
	);
};

export default Profile;
