import {
  CommentOutlined,
  LikeFilled,
  LikeOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Input,
  Layout,
  List,
  Menu,
  Modal,
  Row,
  Space,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CommonHeader from "../../components/Header";
import CreatePostModel from "../../components/Model/AddPost";
import { getProfileData } from "../../services/authService";
import {
  addComment,
  createOwnPost,
  followUser,
  getAllOtherPost,
  likePost,
  unLikePost,
  unfollowUser,
} from "../../services/postService";

const { Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [commentInput, setCommentInput] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [selectedComments, setSelectedComments] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [followingUsers, setFollowingUsers] = useState([]);
  const navigate = useNavigate();
  const currentUser = localStorage.getItem('userId');

  const handleNavigateProfile = () => navigate("/profile");

  const likePosts = async (postId) => {
    try {
      const response = await likePost(postId);
      return response.data;
    } catch (error) {
      console.error("Error liking post:", error);
      return null;
    }
  };

  const unlikePost = async (postId) => {
    try {
      const response = await unLikePost(postId);
      return response.data;
    } catch (error) {
      console.error("Error unliking post:", error);
      return null;
    }
  };

  const handleLike = async (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );

    try {
      const post = posts?.find((p) => p.id === postId);
      if (post.liked) {
        await unlikePost(postId);
      } else {
        await likePosts(postId);
      }
    } catch (error) {
      console.error("Failed to update like status:", error);
    }
  };

  const getAllOtherPosts = async () => {
    try {
      const response = await getAllOtherPost();
      if (response.success) {
        const formattedPosts = response?.data?.map((post) => ({
          ...post,
          likes: post.likes.length, // Convert likes array to count
          liked: post.likes.some(
            (like) => like.userId === currentUser
          ), // Check if the user liked it
          comments: post.comments || [], // Ensure comments is always an array
        }));
        setPosts(formattedPosts);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddComment = async (postId) => {
    if (!commentInput[postId]) return;

    try {
      const response = await addComment(postId, {
        content: commentInput[postId],
      });
      if (response.success) {
        const updatedPosts = posts.map((post) =>
          post.id === postId
            ? { ...post, comments: [...post.comments, response.data] }
            : post
        );
        setPosts(updatedPosts);
        setCommentInput({ ...commentInput, [postId]: "" });
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
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
  const openCommentModal = (comments) => {
    setSelectedComments(comments || []);
    setIsCommentModalVisible(true);
  };
  const openProfilePage = (userData) => {
    setSelectedUser(userData?.user || []);
    setIsProfileModalVisible(true);
  };

  const handleCommentModalCancel = () => {
    setIsCommentModalVisible(false);
  };
  const handleProfileModalCancel = () => {
    setIsProfileModalVisible(false);
  };

  const handleFollowToggle = async (userId) => {
    try {
      let response = "";
      const isFollowing = followingUsers.includes(userId);

      if (isFollowing) {
        // Unfollow logic
        response = await unfollowUser(userId);
        setFollowingUsers(followingUsers.filter((id) => id !== userId));
      } else {
        // Follow logic
        response = await followUser(userId);
        setFollowingUsers([...followingUsers, userId]);
      }
      toast.success(response?.data?.message);
      handleProfileModalCancel();
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };
  const fetchProfile = async () => {
    try {
      const response = await getProfileData();
      setFollowingUsers(response?.data?.following.map((user) => user.id));
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchProfile();
  }, []);

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
                <Row justify="space-between col-12">
                  <Space align="start">
                    <Avatar
                      size="large"
                      icon={<UserOutlined />}
                      onClick={() => openProfilePage(post)}
                    />
                    <div>
                      <Title level={4}>{post.user?.username}</Title>
                      <Paragraph>{post.content}</Paragraph>
                      {post.image && (
                        <img
                          src={post.image}
                          alt="Post"
                          style={{ width: "100%", borderRadius: 8 }}
                        />
                      )}
                    </div>
                  </Space>
                  <Row justify="end">
                    <Col>
                      {parseInt(post.user.id) !== parseInt(currentUser) && <Button
                        type="primary"
                        onClick={() => handleFollowToggle(post.user.id)}
                      >
                        {followingUsers.includes(post.user.id)
                          ? "Following"
                          : "Follow"}
                      </Button>}
                    </Col>
                  </Row>
                </Row>
                <Divider />
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
                    {post.likes} Likes
                  </Button>

                  <Button
                    type="text"
                    icon={<CommentOutlined />}
                    onClick={() => {
                      openCommentModal(post?.comments);
                    }}
                  >
                    {post.comments.length} Comments
                  </Button>
                </Space>
                <div style={{ display: "flex", marginTop: 10 }}>
                  <Input
                    value={commentInput[post.id] || ""}
                    onChange={(e) =>
                      setCommentInput({
                        ...commentInput,
                        [post.id]: e.target.value,
                      })
                    }
                    placeholder="Write a comment..."
                  />
                  <Button
                    type="primary"
                    style={{ marginLeft: 10 }}
                    onClick={() => handleAddComment(post.id)}
                  >
                    Post
                  </Button>
                </div>
              </Card>
            </List.Item>
          )}
        />
      </Content>
      <Footer className="text-center py-4">
        © 2025 Social App. All rights reserved.
      </Footer>
      <CreatePostModel
        isModalVisible={isModalVisible}
        handleCancel={handleCancel}
        handleAddPost={handleAddPost}
      />
      <Modal
        title="List of Comments..."
        visible={isCommentModalVisible}
        onCancel={handleCommentModalCancel}
        footer={null}
      >
        <List
          dataSource={selectedComments}
          renderItem={(comment) => (
            <List.Item>
              <Space align="start">
                <Avatar icon={<UserOutlined />} />
                <div>
                  <Title level={5}>
                    {comment?.user?.username || "Anonymous"}
                  </Title>
                  <Paragraph>{comment.content}</Paragraph>
                </div>
              </Space>
            </List.Item>
          )}
        />
      </Modal>
      <Modal
        title="User Profile..."
        visible={isProfileModalVisible}
        onCancel={handleProfileModalCancel}
        footer={null}
      >
        <List
          dataSource={[selectedUser]}
          renderItem={(user) => (
            <List.Item>
              <Space align="start">
                <Avatar icon={<UserOutlined />} />
                <div>
                  <Row className="">
                    <Title level={5}>{user?.username || "Anonymous"}</Title>
                    <div>
                      <Button
                        type="primary"
                        className="ml-5 justify-content-end"
                        onClick={() => handleFollowToggle(user.id)}
                      >
                        {followingUsers.includes(user.id)
                          ? "Following"
                          : "Follow"}
                      </Button>
                    </div>
                  </Row>
                </div>
              </Space>
            </List.Item>
          )}
        />
      </Modal>
    </Layout>
  );
};

export default HomePage;
