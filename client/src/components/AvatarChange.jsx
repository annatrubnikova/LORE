import { useState, useEffect } from "react";
import axios from '../api/axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";


const AvatarChange = ({ avatarOld, id }) => {
  const [avatar, setAvatar] = useState(null);
  const token = Cookies.get('token');
  const [errMsg, setErrMsg] = useState('');
  const navigate = useNavigate();

  const submitEvent = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('avatar', avatar);
      formData.append('id', id);
      const response = await axios.patch(`/users/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      setErrMsg(response.data.message);

      if (response.data) {
        navigate(`/users/${id}`);
      }
    }
    catch (error) {
      setErrMsg(error.response.data.error)
    }
  }

  const setFile = (error) => {
    setAvatar(error.target.files[0]);
    const closestInputFile = error.target.closest('.input-file');
    const inputText = closestInputFile.querySelector('.input-file-text');
    inputText.innerHTML = error.target.files[0].name;
  };
  return (
    <>
      <div className="select-image">
        {errMsg}
        <form onSubmit={submitEvent}>
          <img src={avatarOld && avatarOld !== 'undefined' ? `http://localhost:5000/avatars/${avatarOld}` : ''} className='users-ava' />
          <div><label class="input-file">
            <span class="input-file-text" type="text"></span>
            <input
              className="file-select"
              type="file"
              onChange={setFile}
              accept="image/jpeg,image/png,image/jpg"
            />
            <span class="input-file-btn">Upload file</span>
          </label>
            <button disabled={avatar ? false : true} className="buttonWithIcon" style={{ margin: "5px" }}><FontAwesomeIcon icon={faUpload} /></button>
          </div>
        </form>
      </div>
    </>
  )
}

export default AvatarChange;