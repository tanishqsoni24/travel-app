const asyncHandler = require("express-async-handler");
const { registerUser } = require("../controllers/userControllers");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const { updateUser, deleteUser, getUser, getAllUsers } = require("../controllers/userController");

// Mock dependencies
jest.mock("../models/userModel");
jest.mock("../config/generateToken");

describe("registerUser", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it("should register a new user successfully", async () => {
    const mockUser = {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      password: "hashedpassword",
      pic: "profile.jpg",
    };

    req.body = {
      name: "John Doe",
      email: "john@example.com",
      password: "123456",
      pic: "profile.jpg",
    };

    User.findOne.mockResolvedValue(null); // No existing user
    User.create.mockResolvedValue(mockUser); // Mock successful user creation
    generateToken.mockReturnValue("mocktoken");

    await registerUser(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: "john@example.com" });
    expect(User.create).toHaveBeenCalledWith(req.body);
    expect(generateToken).toHaveBeenCalledWith(undefined);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      _id: "1",
      name: "John Doe",
      email: "john@example.com",
      pic: "profile.jpg",
      token: "mocktoken",
    });
  });

  it("should throw an error if fields are missing", async () => {
    req.body = {
      email: "john@example.com",
      password: "123456",
    };

    await expect(registerUser(req, res)).rejects.toThrow("please Enter all the Fields");

    expect(res.status).toHaveBeenCalledWith(400);
    expect(User.findOne).not.toHaveBeenCalled();
    expect(User.create).not.toHaveBeenCalled();
  });

  it("should throw an error if the user already exists", async () => {
    const mockExistingUser = {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
    };

    req.body = {
      name: "John Doe",
      email: "john@example.com",
      password: "123456",
      pic: "profile.jpg",
    };

    User.findOne.mockResolvedValue(mockExistingUser);

    await expect(registerUser(req, res)).rejects.toThrow("User already exists");

    expect(res.status).toHaveBeenCalledWith(400);
    expect(User.findOne).toHaveBeenCalledWith({ email: "john@example.com" });
    expect(User.create).not.toHaveBeenCalled();
  });

  it("should throw an error if user creation fails", async () => {
    req.body = {
      name: "John Doe",
      email: "john@example.com",
      password: "123456",
      pic: "profile.jpg",
    };

    User.findOne.mockResolvedValue(null); // No existing user
    User.create.mockResolvedValue(null); // User creation fails

    await expect(registerUser(req, res)).rejects.toThrow("User not found");

    expect(res.status).toHaveBeenCalledWith(400);
    expect(User.findOne).toHaveBeenCalledWith({ email: "john@example.com" });
    expect(User.create).toHaveBeenCalledWith(req.body);
  });
});

describe("User Controller", () => {
    let req, res;
  
    beforeEach(() => {
      req = {
        params: { id: "12345" },
        body: {},
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      jest.clearAllMocks();
    });
  
    describe("updateUser", () => {
      it("should update a user successfully", async () => {
        const updatedUser = { _id: "12345", name: "Updated Name" };
        req.body = { name: "Updated Name" };
  
        User.findByIdAndUpdate.mockResolvedValue(updatedUser);
  
        await updateUser(req, res);
  
        expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
          "12345",
          { $set: { name: "Updated Name" } },
          { new: true }
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(updatedUser);
      });
  
      it("should handle errors if the user is not found", async () => {
        User.findByIdAndUpdate.mockRejectedValue(new Error("User not found"));
  
        await updateUser(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
      });
    });
  
    describe("deleteUser", () => {
      it("should delete a user successfully", async () => {
        User.findByIdAndDelete.mockResolvedValue({});
  
        await deleteUser(req, res);
  
        expect(User.findByIdAndDelete).toHaveBeenCalledWith("12345");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith("User has been deleted");
      });
  
      it("should handle errors if the user is not found", async () => {
        User.findByIdAndDelete.mockRejectedValue(new Error("User not found"));
  
        await deleteUser(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
      });
    });
  
    describe("getUser", () => {
      it("should retrieve a user successfully", async () => {
        const mockUser = { _id: "12345", name: "Test User" };
        User.findById.mockResolvedValue(mockUser);
  
        await getUser(req, res);
  
        expect(User.findById).toHaveBeenCalledWith("12345");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockUser);
      });
  
      it("should handle errors if the user is not found", async () => {
        User.findById.mockRejectedValue(new Error("User not found"));
  
        await getUser(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
      });
    });
  
    describe("getAllUsers", () => {
      it("should retrieve all users successfully", async () => {
        const mockUsers = [
          { _id: "12345", name: "Test User 1" },
          { _id: "67890", name: "Test User 2" },
        ];
        User.find.mockResolvedValue(mockUsers);
  
        await getAllUsers(req, res);
  
        expect(User.find).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockUsers);
      });
  
      it("should handle errors if retrieving users fails", async () => {
        User.find.mockRejectedValue(new Error("Error fetching users"));
  
        await getAllUsers(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Error fetching users" });
      });
    });
  });
