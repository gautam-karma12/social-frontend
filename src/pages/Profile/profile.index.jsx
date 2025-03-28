import {
  CommentOutlined,
  DeleteOutlined,
  EditOutlined,
  HomeOutlined,
  LikeFilled,
  LikeOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ProfileOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Drawer,
  Input,
  Layout,
  List,
  Menu,
  Modal,
  Popconfirm,
  Row,
  Space,
  Spin,
  Typography,
  Upload,
} from "antd";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import useCustomNavigation from "../../helper/handleNavigation/index";
import { getProfileData } from "../../services/authService";
import { deletePost, getOwnPost, updatePost } from "../../services/postService";
import "./profile.css"; // Importing CSS for responsiveness

const { Sider, Content } = Layout;
const { Title, Text, Paragraph } = Typography;

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
  const [selectedComments, setSelectedComments] = useState([]);
  const location = useLocation();
  const { goTo } = useCustomNavigation();

  useEffect(() => {
    fetchProfile();
    fetchPosts();
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 150);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getProfileData();
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await getOwnPost();
      setPosts(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = () => setIsEditing(true);
  const handleSaveClick = () => {
    setIsEditing(false);
    toast.success("Profile updated successfully");
  };

  const handleFileChange = (info) => {
    if (info.file.status === "done") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser((prev) => ({ ...prev, profilePic: reader.result }));
      };
      reader.readAsDataURL(info.file.originFileObj);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logout Successfully");
    goTo("/");
  };

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };
  const handleEditPost = (post) => {
    setEditPost(post);
  };
  const handleSavePost = async () => {
    try {
      await updatePost(editPost.id, {
        title: editPost.title,
        content: editPost.content,
      });
      setPosts((prevPosts) =>
        prevPosts.map((p) => (p.id === editPost.id ? editPost : p))
      );
      setEditPost(null);
      toast.success("Post updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update post");
    }
  };
  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      toast.success("Post deleted successfully");
      fetchPosts();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete post");
    }
  };
  const openCommentModal = (comments) => {
    setSelectedComments(comments || []);
    setIsCommentModalVisible(true);
  };

  const handleCommentModalCancel = () => {
    setIsCommentModalVisible(false);
  };
  if (loading) {
    return (
      <Spin
        size="large"
        style={{ display: "flex", justifyContent: "center", marginTop: "20%" }}
      />
    );
  }

  return (
    <Layout className="profile-layout">
      {/* Sidebar for large screens */}
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={220}
        theme="light"
        className="sidebar"
      >
        <Button
          type="text"
          onClick={() => setCollapsed(!collapsed)}
          style={{ width: "100%" }}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
        <Menu mode="inline" selectedKeys={[location.pathname]}>
          <Menu.Item
            key="/home"
            icon={<HomeOutlined />}
            onClick={() => goTo("/home")}
          >
            Home
          </Menu.Item>
          <Menu.Item
            key="/profile"
            icon={<ProfileOutlined />}
            onClick={() => goTo("/profile")}
          >
            Profile
          </Menu.Item>
          <Menu.Item
            key="/logout"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Logout
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Drawer for small screens */}
      <Drawer
        title="Menu"
        placement="left"
        onClose={toggleDrawer}
        visible={drawerVisible}
      >
        <Menu mode="vertical" selectedKeys={[location.pathname]}>
          <Menu.Item
            key="/home"
            icon={<HomeOutlined />}
            onClick={() => goTo("/home")}
          >
            Home
          </Menu.Item>
          <Menu.Item
            key="/profile"
            icon={<ProfileOutlined />}
            onClick={() => goTo("/profile")}
          >
            Profile
          </Menu.Item>
          <Menu.Item
            key="/logout"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Logout
          </Menu.Item>
        </Menu>
      </Drawer>

      <Layout className="content-layout">
        {/* Sticky Header */}
        <div className={`header ${isScrolled ? "scrolled" : ""}`}>
          <Button type="text" onClick={toggleDrawer} className="menu-btn">
            <MenuUnfoldOutlined />
          </Button>
          <Title level={4} style={{ margin: 0 }}>
            Profile
          </Title>
        </div>

        {/* Main Profile Content */}
        <Content className="content mt-5">
          <Card className="profile-card">
            <div className="profile-info">
              <Avatar
                size={64}
                src={user?.profilePic}
                icon={<UserOutlined />}
              />
              <div>
                {isEditing ? (
                  <>
                    <Input
                      value={user?.username}
                      onChange={(e) =>
                        setUser({ ...user, username: e.target.value })
                      }
                      placeholder="Username"
                    />
                    <Input
                      value={user?.email}
                      onChange={(e) =>
                        setUser({ ...user, email: e.target.value })
                      }
                      placeholder="Email"
                      style={{ marginTop: "8px" }}
                    />
                  </>
                ) : (
                  <>
                    <Title level={4}>{user?.username}</Title>
                    <Text>{user?.email}</Text>
                  </>
                )}
              </div>
            </div>
            <div style={{ marginTop: "10px" }}>
              <Row>
                <Col span={4}>
                  <Title level={5}>Posts</Title>
                  <Text>{posts.length || 0}</Text>
                </Col>
                <Col span={4}>
                  <Title level={5}>Followers</Title>
                  <Text>{user?.followersCount || 0}</Text>
                </Col>
                <Col span={4}>
                  <Title level={5}>Following</Title>
                  <Text>{user?.followingCount || 0}</Text>
                </Col>
              </Row>
            </div>

            <Upload
              showUploadList={false}
              beforeUpload={() => false}
              onChange={handleFileChange}
            >
              <Button icon={<UploadOutlined />} style={{ marginTop: "10px" }}>
                Upload Picture
              </Button>
            </Upload>

            <Button
              type="primary"
              icon={isEditing ? <UploadOutlined /> : <EditOutlined />}
              onClick={isEditing ? handleSaveClick : handleEditClick}
              style={{ marginTop: "16px", width: "10%", marginLeft: "2vh" }}
            >
              {isEditing ? "Save" : "Edit"}
            </Button>
          </Card>

          <List
            dataSource={posts}
            renderItem={(post) => (
              <List.Item key={post.id}>
                <Card
                  title={`${post.title}`}
                  className="post-card"
                  extra={
                    <>
                      <EditOutlined
                        className="p-2"
                        onClick={() => handleEditPost(post)}
                      />
                      <Popconfirm
                        title="Are you sure delete this post?"
                        onConfirm={() => handleDeletePost(post.id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <DeleteOutlined />
                      </Popconfirm>
                    </>
                  }
                >
                  <p>{post.content}</p>
                  {post.image && (
                    <img src={`https://social-backend-production-4ffa.up.railway.app${post.image}`} alt="Post" className="post-image" />
                  )}
                  <Row>
                    <Col span={2}>
                      <Button
                        type="text"
                        icon={<LikeFilled />}
                        onClick={() => handleLike(post.id)}
                      >
                        {post.likes.length} Likes
                      </Button>
                    </Col>
                    <Col span={2}>
                      <Button
                        type="text"
                        icon={<CommentOutlined />}
                        onClick={() => {
                          openCommentModal(post?.comments);
                        }}
                      >
                        {post.comments.length} Comments
                      </Button>
                    </Col>
                  </Row>
                </Card>
              </List.Item>
            )}
          />
        </Content>
        {/* Modal for Editing Post */}
        {editPost && (
          <Modal
            title="Edit Post"
            visible={!!editPost}
            onCancel={() => setEditPost(null)}
            onOk={handleSavePost}
          >
            <Input
              value={editPost.title}
              onChange={(e) =>
                setEditPost({ ...editPost, title: e.target.value })
              }
              placeholder="Title"
            />
            <Input.TextArea
              value={editPost.content}
              onChange={(e) =>
                setEditPost({ ...editPost, content: e.target.value })
              }
              placeholder="Content"
              rows={4}
              style={{ marginTop: "10px" }}
            />
          </Modal>
        )}
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
      </Layout>
    </Layout>
  );
}
