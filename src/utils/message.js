const messages = {
  VERIFY: {
    SUBJECT: 'Account Verification',
    HTML: `
          <p class="name content">Hi {name},</p>
          <p>Thank for getting started with VBank! We need a little
          more information to complete your registration, including
          setting up your password. Click below to setup
          your password.</p><br />
          <a
          href="http://localhost:3000/verify/?email={mail}"
          class="sender"
          style="background: linear-gradient(90deg, #396afc, #2948ff);
          border:1px solid #2948ff;
          display:inline-block;
          font-family:sans-serif;
          color: #ffffff;
          font-size:14px;
          line-height:50px;
          text-align:center;
          text-decoration:none;
          width:200px;
          height: 50px;
          margin-top: 20px;"
        >
          Setup Password
        </a>
        <br /><br />
        If you have problems, please paste the above URL into your web browser. <br /><br />
        Thanks, <br />
        VBank Support
          `,

    PLAIN: `
    Hi {name},
    Thank for getting started with VBank! We need a little
    more information to complete your registration, including
    setting up your password. Click below to setup
    your password.<br />
    <a
    href="http://localhost:3000/verify/?email={mail}"
    class="sender"
    style="background: linear-gradient(90deg, #396afc, #2948ff);
    border:1px solid #2948ff;
    display:inline-block;
    font-family:sans-serif;
    color: #ffffff;
    font-size:14px;
    line-height:50px;
    text-align:center;
    text-decoration:none;
    width:200px;
    height: 50px;
    margin-top: 20px;"
  >
    Setup Password
  </a>
  <br /><br />
  If you have problems, please paste the above URL into your web browser. <br /><br />
  Thanks, <br />
  VBank Support
    `,
  },
};

export { messages as default };
