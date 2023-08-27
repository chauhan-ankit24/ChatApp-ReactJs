import React from "react";
import { useNavigate } from "react-router-dom";
import { BiPowerOff } from "react-icons/bi";
import styled from "styled-components";
import axios from "axios";
import { logoutRoute } from "../utils/APIRoutes";
export default function Logout() {
  const navigate = useNavigate();

  const handleClick = async () => {
    const id = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    )._id;
    const data = await axios.get(`${logoutRoute}/${id}`);
    if (data.status === 200) {
      localStorage.clear();
      navigate("/login");
    }
  };
  return (
    <Button onClick={handleClick}>
      <p>
        LogOut
      </p>
      <BiPowerOff />
    </Button>
  );
}

const Button = styled.button`
  width:6rem;
  height:2rem;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding: 0.3rem;
  // margin-right:1rem;
  color:white;
  border-radius: .3rem;
  background-color: #72A0C1;
  border: none;
  cursor: pointer;
  svg {
    font-size: 1.3rem;
    color: #ebe7ff;
  }
`;
