import dotenv from "dotenv";
import stripePackage from "stripe";

dotenv.config();

const stripe = stripePackage(process.env.STRIPE);

export const checkout = async (req, res, next) => {
  try {
    const { hire } = req.body;
    console.log(hire);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "lkr",
            product_data: {
              name: `Hire from ${hire.from} to ${hire.to}`,
            },
            unit_amount: hire.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:5173/success/${hire._id}`,
      cancel_url: "http://localhost:5173/dashboard?tab=hires",
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Something went wrong!" });
  }
};
