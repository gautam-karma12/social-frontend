import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Avatar,
  Input,
  Button,
  Upload,
  Card,
  List,
  Typography,
  Spin,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  UploadOutlined,
  HomeOutlined,
  MailOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import useCustomNavigation from "../../helper/handleNavigation/index";
import { toast } from "react-toastify";
import { getProfileData } from "../../services/authService";
import { getOwnPost } from "../../services/postService";
import { useLocation } from "react-router-dom";

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { goTo } = useCustomNavigation();

  useEffect(() => {
    fetchProfile();
    fetchPosts();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 150); // Adjust threshold as needed
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
  const handleSaveClick = async () => {
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

  if (loading) {
    return (
      <Spin
        size="large"
        style={{ display: "flex", justifyContent: "center", marginTop: "20%" }}
      />
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider collapsible collapsed={collapsed} trigger={null} width={220} theme='light' style={{ position: 'fixed', height: '100vh', overflowY: 'auto' }}>
        <Button type="text" onClick={() => setCollapsed(!collapsed)} style={{ width: '10%', textAlign: 'left' }}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
        <Menu mode='inline' selectedKeys={[location.pathname]}>
          <Menu.Item key='/home' icon={<HomeOutlined />} onClick={() => goTo("/home")}>
            Home
          </Menu.Item>
          <Menu.Item key='/profile' icon={<ProfileOutlined />} onClick={() => goTo("/profile")}>
            Profile
          </Menu.Item>
          <Menu.Item key='/logout' icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Content */}
      <Layout style={{ marginLeft: 220, padding: "9px" }}>
        {/* Sticky Header */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: collapsed ? 80 : 220,
            right: 0,
            height: "60px",
            backgroundColor: "white",
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            transition: "left 0.3s ease-in-out",
            zIndex: 1000,
          }}
        >
          {!isScrolled && (
            <Title level={4} style={{ margin: 0 }}>
              Profile
            </Title>
          )}
          {isScrolled && user && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginLeft: "20px",
              }}
            >
              <Avatar size={40} src={user.profilePic} icon={<UserOutlined />} />
              <div style={{ marginLeft: "10px" }}>
                <Text strong>{user.username}</Text>
                <br />
                <Text type="secondary">{user.email}</Text>
              </div>
            </div>
          )}
        </div>

        {/* Main Profile Card */}
        <Content
          style={{
            marginTop: "60px",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Card style={{ width: 1670 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Avatar
                size={64}
                src={user?.profilePic}
                icon={<UserOutlined />}
              />
              <div>
                {isEditing ? (
                  <Input
                    value={user?.username}
                    onChange={(e) =>
                      setUser({ ...user, username: e.target.value })
                    }
                  />
                ) : (
                  <Title level={4}>{user?.username}</Title>
                )}
                {isEditing ? (
                  <Input
                    value={user?.email}
                    onChange={(e) =>
                      setUser({ ...user, email: e.target.value })
                    }
                  />
                ) : (
                  <Text>{user?.email}</Text>
                )}
              </div>
            </div>

            <div style={{ marginTop: "10px" }}>
              <Upload
                showUploadList={false}
                beforeUpload={() => false}
                onChange={handleFileChange}
              >
                <Button icon={<UploadOutlined />}>Upload Picture</Button>
              </Upload>
            </div>

            <Button
              type="primary"
              icon={isEditing ? <UploadOutlined /> : <EditOutlined />}
              onClick={isEditing ? handleSaveClick : handleEditClick}
              style={{ marginTop: "16px", width: "9%" }}
            >
              {isEditing ? "Save" : "Edit"}
            </Button>
          </Card>
          <List
            dataSource={posts}
            renderItem={(post) => (
              <List.Item key={post.id}>
                <Card
                  title={post.title}
                  style={{ width: 1200, marginLeft: "10px" }}
                >
                  <p>{post.content}</p>
                  {post.image && (
                    <img
                      src={post.image}
                      alt="Post"
                      style={{
                        width: "100%",
                        maxHeight: "280px",
                        objectFit: "cover",
                      }}
                    />
                  )}
                  <Text>{new Date(post.createdAt).toLocaleDateString()}</Text>
                </Card>
              </List.Item>
            )}
          />
        </Content>
      </Layout>
    </Layout>
  );
}
