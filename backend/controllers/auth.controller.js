const supabase = require("../config/supabase");

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        erro: "Email e senha são obrigatórios.",
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      return res.status(401).json({
        erro: "Email ou senha inválidos.",
      });
    }

    // 🟢 DEPOIS cria o cookie
    res.cookie("token", data.session.access_token, {
      httpOnly: true,
      secure: false, // true em produção
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    });

    return res.json({
      mensagem: "Login realizado com sucesso.",
      user: data.user,
    });

  } catch (err) {
    return res.status(500).json({
      erro: err.message,
    });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.json({ mensagem: "Logout realizado" });
};

exports.me = async (req, res) => {
  return res.json({
    user: req.user,
  });
};