import React, { useEffect, useState } from "react";
import {
	Layout,
	Card,
	List,
	Button,
	Input,
	Space,
	Typography,
	Avatar,
	Divider,
	Modal,
	Menu,
	Dropdown,
} from "antd";
import {
	LikeOutlined,
	LikeFilled,
	CommentOutlined,
	UserOutlined,
	LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import CreatePostModel from "../../components/Model/AddPost";
import { createOwnPost, getAllOtherPost } from "../../services/postService";
import { toast } from "react-toastify";
import CommonHeader from "../../components/Header";

const { Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const HomePage = () => {
	const [posts, setPosts] = useState([]);
	const [commentInput, setCommentInput] = useState({});
	const [isModalVisible, setIsModalVisible] = useState(false);
	const navigate = useNavigate();

	const handleNavigateProfile = () => navigate("/profile");

	const handleLike = (postId) => {
		const updatedPosts = posts.map((post) =>
			post.id === postId
				? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
				: post
		);
		setPosts(updatedPosts);
	};

	const getAllOtherPosts = async () => {
		try {
			const response = await getAllOtherPost();
			if (response.success) setPosts(response?.data);
		} catch (error) {
			console.log(error);
		}
	};

	const handleAddComment = (postId) => {
		if (!commentInput[postId]) return;
		const updatedPosts = posts.map((post) =>
			post.id === postId ? { ...post, comments: [...post.comments, commentInput[postId]] } : post
		);
		setPosts(updatedPosts);
		setCommentInput({ ...commentInput, [postId]: "" });
		toast.success("Comment added!");
	};

	const showModal = () => setIsModalVisible(true);
	const handleCancel = () => setIsModalVisible(false);

	const handleAddPost = async (values) => {
		try {
			await createOwnPost(values);
			setIsModalVisible(false);
		} catch (error) {
			console.log("Error creating post", error);
		}
	};

	const handleLogout = () => {
		localStorage.removeItem("token");
		toast.success("Logout Successfully");
		navigate("/");
	};

	const menu = (
		<Menu>
			<Menu.Item key="1" onClick={handleNavigateProfile}>
				<UserOutlined /> Profile
			</Menu.Item>
			<Menu.Item key="2" onClick={handleLogout}>
				<LogoutOutlined /> Logout
			</Menu.Item>
		</Menu>
	);

	useEffect(() => {
		getAllOtherPosts();
	}, []);

	return (
		<Layout>
			<CommonHeader onCreatePost={showModal} menu={menu} />
			<Content className="container mx-auto p-4 md:p-8">
				<List
					grid={{ gutter: 16, column: 1 }}
					dataSource={posts}
					renderItem={(post) => (
						<List.Item>
							<Card>
								<Space align="start">
									<Avatar size="large" icon={<UserOutlined />} />
									<div>
										<Title level={4}>{post.user?.username}</Title>
										<Paragraph>{post.content}</Paragraph>
									</div>
								</Space>
								<Divider />
								<Space>
									<Button type="text" icon={post.liked ? <LikeFilled style={{ color: "red" }} /> : <LikeOutlined />} onClick={() => handleLike(post.id)}>
										{post.likes || 0}
									</Button>
									<Button type="text" icon={<CommentOutlined />}>{post.comments.length || 0} Comments</Button>
								</Space>
								<div style={{ display: 'flex', marginTop: 10 }}>
									<Input
										value={commentInput[post.id] || ""}
										onChange={(e) => setCommentInput({ ...commentInput, [post.id]: e.target.value })}
										placeholder='Write a comment...'
									/>
									<Button type='primary' style={{ marginLeft: 10 }} onClick={() => handleAddComment(post.id)}>Post</Button>
								</div>
							</Card>
						</List.Item>
					)}
				/>
			</Content>
			<Footer className="text-center py-4">© 2025 Social App. All rights reserved.</Footer>
			<CreatePostModel isModalVisible={isModalVisible} handleCancel={handleCancel} handleAddPost={handleAddPost} />
		</Layout>
	);
};

export default HomePage;
