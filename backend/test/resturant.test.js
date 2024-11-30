const {
    createResturent,
    findResturentByName,
    findFirstFiveResturents,
    findResturentById,
  } = require("../controllers/resturentController");
  
  const Resturent = require("../models/resturentModel");
  
  jest.mock("../models/resturentModel");
  
  describe("Resturent Controller", () => {
    let req, res, next;
  
    beforeEach(() => {
      req = { body: {} };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      next = jest.fn();
      jest.clearAllMocks();
    });
  
    describe("createResturent", () => {
      it("should create a new restaurant if it does not exist", async () => {
        req.body = { name: "Test Restaurant", registrationNo: "12345" };
        const newResturent = { ...req.body, _id: "newRestaurantId" };
  
        Resturent.find.mockResolvedValue([]);
        Resturent.prototype.save = jest.fn().mockResolvedValue(newResturent);
  
        await createResturent(req, res, next);
  
        expect(Resturent.find).toHaveBeenCalledWith({ registrationNo: undefined });
        expect(Resturent.prototype.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(newResturent);
      });
  
      it("should return an error if the restaurant already exists", async () => {
        req.body = { name: "Test Restaurant", registrationNo: "12345" };
        const existingRestaurant = [{ name: "Test Restaurant", registrationNo: undefined }];
  
        Resturent.find.mockResolvedValue(existingRestaurant);
  
        await createResturent(req, res, next);
  
        expect(Resturent.find).toHaveBeenCalledWith({ registrationNo: undefined });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          existingRestaurant,
          error: true,
          message: "Restaurant already exists",
        });
      });
    });
})
  