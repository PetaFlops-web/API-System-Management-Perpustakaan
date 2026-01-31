import { findByIdUser } from "../services/user-service.js";

const getUserById = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      throw new Error("Email is required");
    }

    const user = await findByIdUser(email);
    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

export default { getUserById };
