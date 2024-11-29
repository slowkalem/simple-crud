const emailField = {
  pattern:
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,64}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,64}[a-zA-Z0-9])?)*$/i,
  message: {
    required: "Email tidak boleh kosong",
    pattern: "Email tidak valid",
  },
};

const usernameField = {
  // pattern: /^[a-z0-9_]+$/,
  message: {
    required: "Username wajib diisi",
    // required: "*This field is required" // jika ada lebih dari 1 field yang sama pesan error nya, maka akan dianggap 1
  },
};

const fullNameField = {
  message: {
    required: "Full Name tidak boleh kosong",
    // required: "*This field is required"
  },
};

const passwordField = {
  pattern:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, // (min. 8 chars, 1 lowercase, 1 uppercase, 1 special char)
  // pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, // (min. 8 chars, 1 lowercase, 1 uppercase, tapi special char tidak boleh)
  // pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/, // (min. 8 chars, 1 lowercase, 1 uppercase, special char optional)
  message: {
    required: "Password wajib diisi",
    pattern:
      "Password minimal 8 karakter, setidaknya 1 huruf besar, 1 huruf kecil, 1 nomor dan 1 special karakter!",
    // pattern: "Password contains at least uppercase letter, lowercase letter, and numbers"
  },
};

const passwordConfirmationField = {
  message: {
    required: "Confirm Password tidak boleh kosong",
    only: "Confirm Password harus sama dengan Password",
  },
};

const newPasswordField = {
  pattern: passwordField.pattern,
  message: {
    required: "New password tidak boleh kosong",
    pattern: passwordField.message.pattern,
  },
};

const currentPasswordField = {
  message: {
    required: "Current password tidak boleh kosong",
  },
};

const newPasswordConfirmationField = {
  message: {
    required: "Confirm Password tidak boleh kosong",
    only: "Confirm Password harus sama dengan New Password",
  },
};

const phoneField = {
  pattern: /^[0-9]+$/,
  // pattern: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im,
  // pattern: /^\s*\d*\s*$/,
  // pattern: /[0][8][0-9]{7,11}$/, // ex: 08x{7,11}
  message: {
    required: "Phone tidak boleh kosong",
    pattern: "Phone tidak valid",
  },
};

const OTPField = {
  message: {
    required: "OTP code tidak boleh kosong",
  },
};

const nameField = {
  message: {
    required: "Name tidak boleh kosong",
  },
};

const subjectField = {
  message: {
    required: "Subject tidak boleh kosong",
  },
};

const messageField = {
  message: {
    required: "Message tidak boleh kosong",
  },
};

const titleField = {
  message: {
    required: "Title tidak boleh kosong",
  },
};

const descriptionField = {
  message: {
    required: "Description tidak boleh kosong",
  },
};

const statusField = {
  message: {
    required: "Status tidak boleh kosong",
  },
};

const functionIdField = {
  message: {
    required: "Function ID tidak boleh kosong",
  },
};

const actionField = {
  message: {
    required: "Action tidak boleh kosong",
  },
};

const HTTPMethodField = {
  message: {
    required: "Action tidak boleh kosong",
  },
};

const APIURLNameField = {
  message: {
    required: "Action tidak boleh kosong",
  },
};

const groupIdField = {
  message: {
    required: "Group ID tidak boleh kosong",
  },
};

const permissionAPIIdField = {
  message: {
    required: "Permission API ID tidak boleh kosong",
  },
};

module.exports = {
  emailField,
  usernameField,
  passwordField,
  passwordConfirmationField,
  phoneField,
  OTPField,
  newPasswordField,
  newPasswordConfirmationField,
  fullNameField,
  currentPasswordField,
  nameField,
  subjectField,
  messageField,
  titleField,
  descriptionField,
  statusField,
  functionIdField,
  actionField,
  HTTPMethodField,
  APIURLNameField,
  groupIdField,
  permissionAPIIdField,
};
