import * as yup from "yup";
import { config } from "dotenv";
import { BadRequestException } from "@nestjs/common";
import BaseValidation from "../validation";

config();

describe("Base Validation", () => {
  const testing = new (class TestValidate extends BaseValidation {
    public async testValidate(schema: yup.Schema, data: any) {
      return await this.validate(schema, data);
    }

    public testPasswordValidate(password: string) {
      return this.passwordValidation(password);
    }
  })();

  describe("validate method", () => {
    const schema = yup.object().shape({
      name: yup.string().required(),
      age: yup.number().required(),
    });

    it("should validate data successfully", async () => {
      const data = { name: "John Doe", age: 25 };

      const result = await testing.testValidate(schema, data);

      expect(result).toEqual(data);
    });

    it("should thrown an error", async () => {
      await expect(
        testing.testValidate(schema, { name: 25, age: "John Doe" })
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("passwordValidation method", () => {
    it("should validate data successfully", () => {
      expect(testing.testPasswordValidate("@Qwertyui123")).toBeTruthy();
    });

    it("should throw an error", async () => {
      try {
        testing.testPasswordValidate("tes");
      } catch (err) {
        expect(err).toBeInstanceOf(Object);
      }
    });
  });
});
