const {
    createRoom,
    updateRoom,
    deleteRoom,
    getRoom,
    getAllRoom,
    updateRoomAvailability,
  } = require("../controllers/room");
  
  const Room = require("../models/Room");
  const Hotel = require("../models/Hotel");
  
  // Mocking Room and Hotel models
  jest.mock("../models/Room");
  jest.mock("../models/Hotel");
  
  describe("Room Controller", () => {
    let req, res, next;
  
    beforeEach(() => {
      req = { params: {}, body: {} };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      next = jest.fn();
      jest.clearAllMocks();
    });
  
    describe("createRoom", () => {
      it("should create a new room and update hotel with the room ID", async () => {
        req.params.hotelid = "12345";
        req.body = { name: "Deluxe Room" };
  
        const savedRoom = { _id: "room123", name: "Deluxe Room" };
  
        Room.prototype.save = jest.fn().mockResolvedValue(savedRoom);
        Hotel.findByIdAndUpdate.mockResolvedValue();
  
        await createRoom(req, res, next);
  
        expect(Room.prototype.save).toHaveBeenCalled();
        expect(Hotel.findByIdAndUpdate).toHaveBeenCalledWith(
          "12345",
          { $push: { rooms: "room123" } }
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(savedRoom);
      });
  
      it("should handle errors during room creation", async () => {
        Room.prototype.save = jest.fn().mockRejectedValue(new Error("Save failed"));
  
        await createRoom(req, res, next);
  
        expect(next).toHaveBeenCalledWith(new Error("Save failed"));
      });
    });
  
    describe("updateRoom", () => {
      it("should update a room", async () => {
        req.params.id = "room123";
        req.body = { name: "Updated Room" };
  
        const updatedRoom = { _id: "room123", name: "Updated Room" };
        Room.findByIdAndUpdate.mockResolvedValue(updatedRoom);
  
        await updateRoom(req, res, next);
  
        expect(Room.findByIdAndUpdate).toHaveBeenCalledWith(
          "room123",
          { $set: req.body },
          { new: true }
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(updatedRoom);
      });
  
      it("should handle errors during room update", async () => {
        Room.findByIdAndUpdate.mockRejectedValue(new Error("Update failed"));
  
        await updateRoom(req, res, next);
  
        expect(next).toHaveBeenCalledWith(new Error("Update failed"));
      });
    });
  
    describe("updateRoomAvailability", () => {
      it("should update room availability", async () => {
        req.params.id = "roomNumber123";
        req.body = { dates: ["2024-12-01", "2024-12-02"] };
  
        Room.updateOne.mockResolvedValue();
  
        await updateRoomAvailability(req, res, next);
  
        expect(Room.updateOne).toHaveBeenCalledWith(
          { "roomNumbers._id": "roomNumber123" },
          { $push: { "roomNumbers.$.unavailableDates": req.body.dates } }
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith("room updatedd");
      });
  
      it("should handle errors during availability update", async () => {
        Room.updateOne.mockRejectedValue(new Error("Update failed"));
  
        await updateRoomAvailability(req, res, next);
  
        expect(next).toHaveBeenCalledWith(new Error("Update failed"));
      });
    });
  
    describe("deleteRoom", () => {
      it("should delete a room and update the hotel", async () => {
        req.params = { id: "room123", hotelid: "hotel123" };
  
        Room.findByIdAndDelete.mockResolvedValue();
        Hotel.findByIdAndUpdate.mockResolvedValue();
  
        await deleteRoom(req, res, next);
  
        expect(Room.findByIdAndDelete).toHaveBeenCalledWith("room123");
        expect(Hotel.findByIdAndUpdate).toHaveBeenCalledWith(
          "hotel123",
          { $pull: { rooms: "room123" } }
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith("Room has been deleted.");
      });
  
      it("should handle errors during room deletion", async () => {
        Room.findByIdAndDelete.mockRejectedValue(new Error("Delete failed"));
  
        await deleteRoom(req, res, next);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(new Error("Delete failed"));
      });
    });
  
    describe("getRoom", () => {
      it("should fetch a room by ID", async () => {
        req.params.id = "room123";
        const mockRoom = { _id: "room123", name: "Test Room" };
  
        Room.findById.mockResolvedValue(mockRoom);
  
        await getRoom(req, res, next);
  
        expect(Room.findById).toHaveBeenCalledWith("room123");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockRoom);
      });
  
      it("should handle errors during room fetch", async () => {
        Room.findById.mockRejectedValue(new Error("Fetch failed"));
  
        await getRoom(req, res, next);
  
        expect(next).toHaveBeenCalledWith(new Error("Fetch failed"));
      });
    });
  
    describe("getAllRoom", () => {
      it("should fetch all rooms", async () => {
        const mockRooms = [{ _id: "room1" }, { _id: "room2" }];
        Room.find.mockResolvedValue(mockRooms);
  
        await getAllRoom(req, res, next);
  
        expect(Room.find).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockRooms);
      });
  
      it("should handle errors during fetch all rooms", async () => {
        Room.find.mockRejectedValue(new Error("Fetch failed"));
  
        await getAllRoom(req, res, next);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(new Error("Fetch failed"));
      });
    });
  });
  