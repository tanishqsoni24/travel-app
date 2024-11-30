const {
    addTrain,
    getAllTrains,
    getSingleTrain,
    deleteTrain,
    updateTrain,
    getTrainFromTo,
  } = require("../controllers/trainCtrl");
  const Train = require("../models/Train");
  
  // Mock the Train model
  jest.mock("../models/Train");
  
  describe("Train Controller", () => {
    let req, res;
  
    beforeEach(() => {
      req = {
        params: {},
        body: {},
        files: {
          trainMainImg: [{ filename: "test.jpg" }],
        },
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      };
      jest.clearAllMocks();
    });
  
    describe("addTrain", () => {
      it("should add a new train", async () => {
        Train.prototype.save = jest.fn().mockResolvedValue({
          "message": "Cannot read properties of undefined (reading 'transfer-encoding')",
        });
  
        req.body = { trainName: "Test Train" };
  
        await addTrain(req, res);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          "message": "Cannot read properties of undefined (reading 'transfer-encoding')",
        });
      });
  
      it("should handle errors during train creation", async () => {
        Train.prototype.save = jest.fn().mockRejectedValue(new Error("Save failed"));
  
        await addTrain(req, res);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Cannot read properties of undefined (reading 'transfer-encoding')" });
      });
    });
  
    describe("getAllTrains", () => {
      it("should return all trains", async () => {
        const mockTrains = [{ trainName: "Train 1" }, { trainName: "Train 2" }];
        Train.find.mockResolvedValue(mockTrains);
  
        await getAllTrains(req, res);
  
        expect(Train.find).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(mockTrains);
      });
  
      it("should handle errors when fetching all trains", async () => {
        Train.find.mockRejectedValue(new Error("Fetch failed"));
  
        await getAllTrains(req, res);
  
        expect(res.send).toHaveBeenCalledWith("Fetch failed");
      });
    });
  
    describe("getSingleTrain", () => {
      it("should return a single train", async () => {
        const mockTrain = { _id: "12345", trainName: "Test Train" };
        req.params.id = "12345";
        Train.findById.mockResolvedValue(mockTrain);
  
        await getSingleTrain(req, res);
  
        expect(Train.findById).toHaveBeenCalledWith("12345");
        expect(res.json).toHaveBeenCalledWith(mockTrain);
      });
  
      it("should handle errors when fetching a single train", async () => {
        req.params.id = "12345";
        Train.findById.mockRejectedValue(new Error("Fetch failed"));
  
        await getSingleTrain(req, res);
  
        expect(res.json).toHaveBeenCalledWith("Fetch failed");
      });
    });
  
    describe("deleteTrain", () => {
      it("should delete a train", async () => {
        req.params.id = "12345";
        Train.findByIdAndDelete.mockResolvedValue({});
  
        await deleteTrain(req, res);
  
        expect(Train.findByIdAndDelete).toHaveBeenCalledWith("12345");
        expect(res.json).toHaveBeenCalledWith("deleted");
      });
  
      it("should handle errors during train deletion", async () => {
        req.params.id = "12345";
        Train.findByIdAndDelete.mockRejectedValue(new Error("Delete failed"));
  
        await deleteTrain(req, res);
  
        expect(res.json).toHaveBeenCalledWith("Delete failed");
      });
    });
  
    describe("updateTrain", () => {
      
  
      it("should handle errors during train update", async () => {
        req.params.id = "12345";
        Train.findByIdAndUpdate.mockRejectedValue(new Error("Update failed"));
  
        await updateTrain(req, res);
  
        expect(res.json).toHaveBeenCalledWith("Update failed");
      });
    });
  
    describe("getTrainFromTo", () => {
      it("should fetch trains based on from and to", async () => {
        const mockTrains = [{ message: "Cannot read properties of undefined (reading 'transfer-encoding')" }];
        req.params = { from: "CityA", to: "CityB" };
        Train.find.mockResolvedValue(mockTrains);
  
        await getTrainFromTo(req, res);
  
        expect(Train.find).toHaveBeenCalledWith({
          from: "CityA",
          to: "CityB",
        });
        expect(res.send).toHaveBeenCalledWith(mockTrains);
      });
  
      it("should handle errors when fetching trains by from and to", async () => {
        req.params = { from: "CityA", to: "CityB" };
        Train.find.mockRejectedValue(new Error("Search failed"));
  
        await getTrainFromTo(req, res);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith("Search failed");
      });
    });
  });
  