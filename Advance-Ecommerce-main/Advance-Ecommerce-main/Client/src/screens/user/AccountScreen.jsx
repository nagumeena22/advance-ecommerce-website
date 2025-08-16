import styled from "styled-components";
import { Container } from "../../styles/styles";
import Breadcrumb from "../../components/common/Breadcrumb";
import { UserContent, UserDashboardWrapper } from "../../styles/user";
import UserMenu from "../../components/user/UserMenu";
import Title from "../../components/common/Title";
import { FormElement, Input } from "../../styles/form";
import { BaseLinkGreen } from "../../styles/button";
import { Link, useNavigate } from "react-router-dom";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const AccountScreenWrapper = styled.main`
  .address-list {
    margin-top: 20px;
    grid-template-columns: repeat(2, 1fr);
    gap: 25px;

    @media (max-width: ${breakpoints.lg}) {
      grid-template-columns: repeat(1, 1fr);
    }
  }

  .address-item {
    border-radius: 12px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    padding: 25px;
    row-gap: 8px;
  }

  .address-tags {
    gap: 12px;

    li {
      height: 28px;
      border-radius: 8px;
      padding: 2px 12px;
      background-color: ${defaultTheme.color_whitesmoke};
    }
  }

  .address-btns {
    margin-top: 12px;
    .btn-separator {
      width: 1px;
      border-radius: 50px;
      background: ${defaultTheme.color_platinum};
      margin: 0 10px;
    }
  }
`;

const breadcrumbItems = [
  { label: "Home", link: "/" },
  { label: "Account", link: "/account" },
];

const AccountScreen = () => {
  const [user, setUser] = useState(null);
  const [add, setAdd] = useState([]);
  const [editingField, setEditingField] = useState(null);
  const [editValues, setEditValues] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        if (!token) {
          toast.error("Please log in first!");
          navigate("/sign_in");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data.user);
        setAdd(response.data.user?.addressess || []);
      } catch (err) {
        console.error("Error:", err);
        if (err.response?.status === 401) {
          toast.error("Session expired. Please log in again.");
          navigate("/sign_in");
        } else {
          toast.error("Something went wrong while loading profile.");
        }
      }
    };

    authenticateUser();
  }, [navigate]);

  const handleEdit = (field) => {
    setEditingField(field);
    setEditValues({ ...editValues, [field]: user[field] || '' });
  };

  const handleSave = async (field) => {
    try {
      const token = localStorage.getItem("accessToken");
      
      // Create update object with current user data and the new field value
      const updateData = {
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        street: user.street,
        city: user.city,
        state: user.state,
        [field]: editValues[field] // Override with the new value
      };
      
      const response = await axios.put("http://localhost:5000/api/profile", updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setUser({ ...user, [field]: editValues[field] });
        setEditingField(null);
        toast.success(`${field} updated successfully!`);
      }
    } catch (err) {
      console.error("Update Error:", err);
      toast.error("Failed to update profile.");
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValues({});
  };

  return (
    <>
      {user && (
        <AccountScreenWrapper className="page-py-spacing">
          <Container>
            <Breadcrumb items={breadcrumbItems} />
            <UserDashboardWrapper>
              <UserMenu />
              <UserContent>
                <Title titleText={"My Account"} />
                <h4 className="title-sm">Contact Details</h4>
                <form>
                  <div className="form-wrapper">
                    <FormElement className="form-elem">
                      <label className="form-label font-semibold text-base">
                        Your Name
                      </label>
                      <div className="form-input-wrapper flex items-center">
                        {editingField === 'firstName' ? (
                          <>
                            <Input
                              type="text"
                              className="form-elem-control text-outerspace font-semibold"
                              value={editValues.firstName || ''}
                              onChange={(e) => setEditValues({ ...editValues, firstName: e.target.value })}
                            />
                            <button type="button" className="form-control-change-btn" onClick={() => handleSave('firstName')}>
                              Save
                            </button>
                            <button type="button" className="form-control-change-btn ml-2" onClick={handleCancel}>
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <Input
                              type="text"
                              className="form-elem-control text-outerspace font-semibold"
                              value={user.firstName || "N/A"}
                              readOnly
                            />
                            <button type="button" className="form-control-change-btn" onClick={() => handleEdit('firstName')}>
                              Change
                            </button>
                          </>
                        )}
                      </div>
                    </FormElement>

                    <FormElement className="form-elem">
                      <label className="form-label font-semibold text-base">
                        Email Address
                      </label>
                      <div className="form-input-wrapper flex items-center">
                        <Input
                          type="email"
                          className="form-elem-control text-outerspace font-semibold"
                          value={user.email || "N/A"}
                          readOnly
                        />
                        <button type="button" className="form-control-change-btn" disabled>
                          Change
                        </button>
                      </div>
                    </FormElement>

                    <FormElement className="form-elem">
                      <label className="form-label font-semibold text-base">
                        Phone Number
                      </label>
                      <div className="form-input-wrapper flex items-center">
                        {editingField === 'phone' ? (
                          <>
                            <Input
                              type="text"
                              className="form-elem-control text-outerspace font-semibold"
                              value={editValues.phone || ''}
                              onChange={(e) => setEditValues({ ...editValues, phone: e.target.value })}
                              placeholder="Enter phone number"
                            />
                            <button type="button" className="form-control-change-btn" onClick={() => handleSave('phone')}>
                              Save
                            </button>
                            <button type="button" className="form-control-change-btn ml-2" onClick={handleCancel}>
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <Input
                              type="text"
                              className="form-elem-control text-outerspace font-semibold"
                              value={user.phone || "Not present"}
                              readOnly
                            />
                            <button type="button" className="form-control-change-btn" onClick={() => handleEdit('phone')}>
                              Change
                            </button>
                          </>
                        )}
                      </div>
                    </FormElement>

                    <FormElement className="form-elem">
                      <label className="form-label font-semibold text-base">
                        Last Name
                      </label>
                      <div className="form-input-wrapper flex items-center">
                        {editingField === 'lastName' ? (
                          <>
                            <Input
                              type="text"
                              className="form-elem-control text-outerspace font-semibold"
                              value={editValues.lastName || ''}
                              onChange={(e) => setEditValues({ ...editValues, lastName: e.target.value })}
                              placeholder="Enter last name"
                            />
                            <button type="button" className="form-control-change-btn" onClick={() => handleSave('lastName')}>
                              Save
                            </button>
                            <button type="button" className="form-control-change-btn ml-2" onClick={handleCancel}>
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <Input
                              type="text"
                              className="form-elem-control text-outerspace font-semibold"
                              value={user.lastName || "Not set"}
                              readOnly
                            />
                            <button type="button" className="form-control-change-btn" onClick={() => handleEdit('lastName')}>
                              Change
                            </button>
                          </>
                        )}
                      </div>
                    </FormElement>

                    <FormElement className="form-elem">
                      <label className="form-label font-semibold text-base">
                        Street Address
                      </label>
                      <div className="form-input-wrapper flex items-center">
                        {editingField === 'street' ? (
                          <>
                            <Input
                              type="text"
                              className="form-elem-control text-outerspace font-semibold"
                              value={editValues.street || ''}
                              onChange={(e) => setEditValues({ ...editValues, street: e.target.value })}
                              placeholder="Enter street address"
                            />
                            <button type="button" className="form-control-change-btn" onClick={() => handleSave('street')}>
                              Save
                            </button>
                            <button type="button" className="form-control-change-btn ml-2" onClick={handleCancel}>
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <Input
                              type="text"
                              className="form-elem-control text-outerspace font-semibold"
                              value={user.street || "Not set"}
                              readOnly
                            />
                            <button type="button" className="form-control-change-btn" onClick={() => handleEdit('street')}>
                              Change
                            </button>
                          </>
                        )}
                      </div>
                    </FormElement>

                    <FormElement className="form-elem">
                      <label className="form-label font-semibold text-base">
                        City
                      </label>
                      <div className="form-input-wrapper flex items-center">
                        {editingField === 'city' ? (
                          <>
                            <Input
                              type="text"
                              className="form-elem-control text-outerspace font-semibold"
                              value={editValues.city || ''}
                              onChange={(e) => setEditValues({ ...editValues, city: e.target.value })}
                              placeholder="Enter city"
                            />
                            <button type="button" className="form-control-change-btn" onClick={() => handleSave('city')}>
                              Save
                            </button>
                            <button type="button" className="form-control-change-btn ml-2" onClick={handleCancel}>
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <Input
                              type="text"
                              className="form-elem-control text-outerspace font-semibold"
                              value={user.city || "Not set"}
                              readOnly
                            />
                            <button type="button" className="form-control-change-btn" onClick={() => handleEdit('city')}>
                              Change
                            </button>
                          </>
                        )}
                      </div>
                    </FormElement>

                    <FormElement className="form-elem">
                      <label className="form-label font-semibold text-base">
                        State
                      </label>
                      <div className="form-input-wrapper flex items-center">
                        {editingField === 'state' ? (
                          <>
                            <Input
                              type="text"
                              className="form-elem-control text-outerspace font-semibold"
                              value={editValues.state || ''}
                              onChange={(e) => setEditValues({ ...editValues, state: e.target.value })}
                              placeholder="Enter state"
                            />
                            <button type="button" className="form-control-change-btn" onClick={() => handleSave('state')}>
                              Save
                            </button>
                            <button type="button" className="form-control-change-btn ml-2" onClick={handleCancel}>
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <Input
                              type="text"
                              className="form-elem-control text-outerspace font-semibold"
                              value={user.state || "Not set"}
                              readOnly
                            />
                            <button type="button" className="form-control-change-btn" onClick={() => handleEdit('state')}>
                              Change
                            </button>
                          </>
                        )}
                      </div>
                    </FormElement>
                  </div>
                </form>

                <div>
                  <h4 className="title-sm">My Contact Addresses</h4>
                  <BaseLinkGreen to="/account/add">Add Address</BaseLinkGreen>
                  <div className="address-list grid">
                    {add.map((item, index) => (
                      <div className="address-item grid" key={index}>
                        <p className="text-outerspace text-lg font-semibold address-title">
                          {item.firstName}
                        </p>
                        <p className="text-gray text-base font-medium address-description">
                          {item.street}, {item.city}, {item.state}
                        </p>
                        <div className="address-btns flex">
                          <button
                            className="text-base text-outerspace font-semibold"
                            onClick={() => toast.info("Remove functionality coming soon!")}
                          >
                            Remove
                          </button>
                          <div className="btn-separator"></div>
                          <button
                            className="text-base text-outerspace font-semibold"
                            onClick={() => toast.info("Edit functionality coming soon!")}
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    ))}

                    {user.street && (
                      <div className="address-item grid">
                        <p className="text-outerspace text-lg font-semibold address-title">
                          {user.firstName}
                        </p>
                        <p className="text-gray text-base font-medium address-description">
                          {user.street}, {user.city}, {user.state}
                        </p>
                        <ul className="address-tags flex flex-wrap">
                          {user.defaultAdd && (
                            <li className="text-gray text-base font-medium inline-flex items-center justify-center">
                              Default billing address
                            </li>
                          )}
                        </ul>
                        <div className="address-btns flex">
                          <button
                            className="text-base text-outerspace font-semibold"
                            onClick={() => toast.info("Remove functionality coming soon!")}
                          >
                            Remove
                          </button>
                          <div className="btn-separator"></div>
                          <button
                            className="text-base text-outerspace font-semibold"
                            onClick={() => toast.info("Edit functionality coming soon!")}
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </UserContent>
            </UserDashboardWrapper>
          </Container>
        </AccountScreenWrapper>
      )}
    </>
  );
};

export default AccountScreen;
