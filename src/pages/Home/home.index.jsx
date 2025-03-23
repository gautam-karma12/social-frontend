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
	Upload,
	message,
	Menu,
	Dropdown,
} from "antd";
import {
	LikeOutlined,
	LikeFilled,
	CommentOutlined,
	UserOutlined,
	PlusOutlined,
	UploadOutlined,
	LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import CreatePostModel from "../../components/Model/AddPost/index"
import {createOwnPost} from "../../services/postService"
const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
import CommonHeader from "../../components/Header/index"
import { getAllOtherPost } from "../../services/postService";
import { toast } from "react-toastify";
const initialPosts = [
	{
		id: 1,
		user: "John Doe",
		content: "Enjoying the beach vibes 🌊🌴",
		image: "",
		likes: 10,
		comments: ["Looks amazing!", "Wish I was there!"],
		liked: false,
		owner: "John Doe",
	},
	{
		id: 2,
		user: "Alice Smith",
		content: "Just finished a 10k run 🏃‍♀️💪",
		image: "",
		likes: 5,
		comments: ["Congrats!", "That's awesome!"],
		liked: false,
		owner: "Alice Smith",
	},
];

const App = () => {
	const [posts, setPosts] = useState(initialPosts);
	const [commentInput, setCommentInput] = useState({});
	const [isModalVisible, setIsModalVisible] = useState(false); // To toggle between profile and feed
	const navigate = useNavigate();
	const [newPost, setNewPost] = useState({
		title: "",
		content: "",
		image: "",
	});
	const handleNavigateProfile = () => {
		navigate("/profile");
	};

	// Toggle like
	const handleLike = (postId) => {
		const updatedPosts = posts.map((post) =>
			post.id === postId
				? {
						...post,
						liked: !post.liked,
						likes: post.liked ? post.likes - 1 : post.likes + 1,
				  }
				: post,
		);
		setPosts(updatedPosts);
	};

	const getAllOtherPosts = async () =>{
		try {
			const response = await getAllOtherPost();
            if(response.success) {
				setPosts(response?.data);
				setLoading(false);
			}
		} catch (error) {
			console.log(error);
		}
	}

	// Add comment
	const handleAddComment = (postId) => {
		if (!commentInput[postId]) return;
		const updatedPosts = posts.map((post) =>
			post.id === postId
				? { ...post, comments: [...post.comments, commentInput[postId]] }
				: post,
		);
		setPosts(updatedPosts);
		setCommentInput({ ...commentInput, [postId]: "" });
		message.success("Comment added!");
	};

	// Show/Hide Modal
	const showModal = () => setIsModalVisible(true);
	const handleCancel = () => setIsModalVisible(false);

	// Handle image upload
	const handleUpload = (info) => {
		if (info.file.status === "done") {
			message.success(`${info.file.name} uploaded successfully`);
			const imageUrl = URL.createObjectURL(info.file.originFileObj);
			setNewPost({ ...newPost, image: imageUrl });
		}
	};

	// Add new post
	const handleAddPost = async(values) => {
		try {
			const response = await createOwnPost(values);
			console.log("response: " ,response);
		} catch (error) {
			console.log("error creating",error)
		}
		setIsModalVisible(false);
	};

	const handleLogout = ()=>{
		localStorage.removeItem("token");
		toast.success('Logout Successfully ');
        navigate("/");
	}

	// Dropdown Menu
	const menu = (
		<Menu>
			<Menu.Item key="1" onClick={() => handleNavigateProfile()}>
				<UserOutlined /> Profile
			</Menu.Item>
			<Menu.Item key="2" onClick={() => handleLogout()}>
				<LogoutOutlined /> Logout
			</Menu.Item>
		</Menu>
	);

	useEffect(()=>{
		getAllOtherPosts();
	},[])
	return (
		<div>
			{/* Header */}
            <CommonHeader onCreatePost={showModal} menu={menu} />
			{/* Content: Profile or Feed */}
			<Content style={{ padding: "100px" }}>
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
										{post.image && (
											<img
												src={post.image}
												alt="Post"
												style={{
													width: "100%",
													maxHeight: "400px",
													objectFit: "cover",
													borderRadius: "8px",
												}}
											/>
										)}
									</div>
								</Space>
								<Divider />

								{/* Like and Comment Section */}
								<Space>
									<Button
										type="text"
										icon={
											post.liked ? (
												<LikeFilled style={{ color: "red" }} />
											) : (
												<LikeOutlined />
											)
										}
										onClick={() => handleLike(post.id)}
									>
										{post.likes.length || 0 }
									</Button>

									<Button type="text" icon={<CommentOutlined />}>
										{post.comments.length || 0} Comments
									</Button>
								</Space>

								{/* Comment Section */}
								<List
									size="small"
									dataSource={post.comments}
									renderItem={(comment, index) => (
										<List.Item>
											<Text>{comment}</Text>
										</List.Item>
									)}
								/>

								<Space style={{ marginTop: "10px" }}>
									<Input
										placeholder="Add a comment..."
										value={commentInput[post.id] || ""}
										onChange={(e) =>
											setCommentInput({
												...commentInput,
												[post.id]: e.target.value,
											})
										}
									/>
									<Button
										type="primary"
										onClick={() => handleAddComment(post.id)}
									>
										Add
									</Button>
								</Space>
							</Card>
						</List.Item>
					)}
				/>
			</Content>

			{/* Footer */}
			<Footer style={{ textAlign: "center" }} className="mt-5">
				© 2025 Connectify. All rights reserved.
			</Footer>

			{/* Modal for Creating New Post */}
			<CreatePostModel isModalVisible={isModalVisible} handleCancel={handleCancel} handleAddPost={handleAddPost}/>
		</div>
	);
};

export default App;
