// import React from 'react';
// import Avatar, { ConfigProvider } from 'react-avatar';
// import randomColor from 'randomcolor';

// export default function Client({ username }) {
//   const randomAvatarColor = randomColor();

//   return (
//     <ConfigProvider>
//       <div className="client ms-1 ">
//         <Avatar
//           name={username}
//           size={40}
//           color={randomAvatarColor}
//           round="14px"
//         />
//         <br />
//         <span className='userName ps-3' style={{ fontSize: '10px' }}>{username}</span>
//       </div>
//     </ConfigProvider>
//   );
// }


import React, { useState, useEffect } from 'react';
import Avatar, { ConfigProvider } from 'react-avatar';
import randomColor from 'randomcolor';

export default function Client({ username }) {
  const [avatarColor, setAvatarColor] = useState('');

  useEffect(() => {
    // Generate a random color once when the component mounts
    const randomAvatarColor = randomColor();
    setAvatarColor(randomAvatarColor);
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return (
    <ConfigProvider>
      <div className="client ms-1">
        <Avatar
          name={username}
          size={40}
          color={avatarColor}
          round="14px"
        />
        <br />
        <span className='userName ps-3' style={{ fontSize: '10px' }}>{username}</span>
      </div>
    </ConfigProvider>
  );
}
