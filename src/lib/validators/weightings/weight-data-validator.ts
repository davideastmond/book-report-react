import { z } from "zod";

const weightDataObject = z.object({
  name: z.string().min(1, "Name is required"),
  percentage: z
    .number()
    .min(0, "Percentage must be at least 0")
    .max(100, "Percentage must be at most 100"),
  id: z.string().nonempty("ID is required"),
});

export const weightDataValidator = z.array(weightDataObject).refine((data) => {
  const totalPercentage = data.reduce((sum, item) => sum + item.percentage, 0);
  return totalPercentage === 100;
}, "Total percentage must equal 100");
