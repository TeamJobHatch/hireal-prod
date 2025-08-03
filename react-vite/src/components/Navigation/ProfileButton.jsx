import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { thunkLogout } from "../../redux/session";

function ProfileButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.session.user);
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef(null);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu((prev) => !prev);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(thunkLogout());
    setShowMenu(false);
    navigate('/');
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleMenu}
        className="flex items-center text-gray-700 hover:text-blue-600 focus:outline-none"
      >
        <FaUserCircle className="text-2xl" />
      </button>

      {showMenu && (
        <ul
          ref={ulRef}
          className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-[1100]"
        >
          {user ? (
            <>
              <li className="px-4 py-2 text-sm text-gray-500">{user.email}</li>
              <li>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Log Out
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <button
                  onClick={() => {
                    navigate('/login');
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
                >
                  Log In
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    navigate('/signup');
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
                >
                  Sign Up
                </button>
              </li>
            </>
          )}
        </ul>
      )}
    </div>
  );
}

export default ProfileButton;






