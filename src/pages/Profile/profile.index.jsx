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
  Drawer
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  UploadOutlined,
  HomeOutlined,
  LogoutOutlined,
  ProfileOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from "@ant-design/icons";
import useCustomNavigation from "../../helper/handleNavigation/index";
import { toast } from "react-toastify";
import { getProfileData } from "../../services/authService";
import { getOwnPost } from "../../services/postService";
import { useLocation } from "react-router-dom";
import "./profile.css"; // Importing CSS for responsiveness

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
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
        <Button type="text" onClick={() => setCollapsed(!collapsed)} style={{ width: "100%" }}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
        <Menu mode="inline" selectedKeys={[location.pathname]}>
          <Menu.Item key="/home" icon={<HomeOutlined />} onClick={() => goTo("/home")}>
            Home
          </Menu.Item>
          <Menu.Item key="/profile" icon={<ProfileOutlined />} onClick={() => goTo("/profile")}>
            Profile
          </Menu.Item>
          <Menu.Item key="/logout" icon={<LogoutOutlined />} onClick={handleLogout}>
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
          <Menu.Item key="/home" icon={<HomeOutlined />} onClick={() => goTo("/home")}>
            Home
          </Menu.Item>
          <Menu.Item key="/profile" icon={<ProfileOutlined />} onClick={() => goTo("/profile")}>
            Profile
          </Menu.Item>
          <Menu.Item key="/logout" icon={<LogoutOutlined />} onClick={handleLogout}>
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
          <Title level={4} style={{ margin: 0 }}>Profile</Title>
        </div>

        {/* Main Profile Content */}
        <Content className="content mt-5">
          <Card className="profile-card">
            <div className="profile-info">
              <Avatar size={64} src={user?.profilePic} icon={<UserOutlined />} />
              <div>
                {isEditing ? (
                  <>
                    <Input
                      value={user?.username}
                      onChange={(e) => setUser({ ...user, username: e.target.value })}
                      placeholder="Username"
                    />
                    <Input
                      value={user?.email}
                      onChange={(e) => setUser({ ...user, email: e.target.value })}
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
              style={{ marginTop: "16px", width: "10%" , marginLeft: "2vh"}}
            >
              {isEditing ? "Save" : "Edit"}
            </Button>
          </Card>

          <List
            dataSource={posts}
            renderItem={(post) => (
              <List.Item key={post.id}>
                <Card title={post.title} className="post-card">
                  <p>{post.content}</p>
                  {post.image && (
                    <img
                      src={post.image}
                      alt="Post"
                      className="post-image"
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
