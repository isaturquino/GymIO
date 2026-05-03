import { supabase } from "../config/supabase.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password
    });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.json(data);
};