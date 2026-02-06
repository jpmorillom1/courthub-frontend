import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageWithFallback } from "../common/ImageWithFallback";
import { useAuth } from "../../store/authStore";

const FACULTIES = [
  "INGENIERÍA Y CIENCIAS APLICADAS",
  "CIENCIAS MÉDICAS",
  "JURISPRUDENCIA, CIENCIAS POLÍTICAS Y SOCIALES",
  "CIENCIAS ECONÓMICAS",
  "CIENCIAS",
  "CIENCIAS ADMINISTRATIVAS",
  "FILOSOFÍA, LETRAS Y CIENCIAS DE LA EDUCACIÓN",
  "CIENCIAS SOCIALES Y HUMANAS",
  "ARQUITECTURA Y URBANISMO",
  "ARTES",
  "CIENCIAS AGRÍCOLAS",
  "CIENCIAS BIOLÓGICAS",
  "CIENCIAS DE LA DISCAPACIDAD, ATENCIÓN PREHOSPITALARIA Y DESASTRES",
  "CIENCIAS PSICOLÓGICAS",
  "CIENCIAS QUÍMICAS",
  "COMUNICACIÓN SOCIAL",
  "CULTURA FÍSICA",
  "INGENIERÍA EN GEOLOGÍA, MINAS, PETRÓLEOS Y AMBIENTAL",
  "INGENIERÍA QUÍMICA",
  "MEDICINA VETERINARIA Y ZOOTECNIA",
];

const registerSchema = z
  .object({
    name: z.string().min(1, "Full name is required"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
    faculty: z
      .string()
      .refine((value) => FACULTIES.includes(value), "Select a faculty"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState("");
  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      faculty: "",
    },
  });

  const onSubmit = async (data) => {
    setError("");

    try {
      const { name, email, password, faculty } = data;
      const result = await register({ name, email, password, faculty });
      if (result.success) {
        navigate("/login");
      } else {
        setError(result.error || "Registration failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Column - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">
          {/* Logo centered */}
          <div className="flex justify-center mb-6">
            <ImageWithFallback
              src="https://aka-cdn.uce.edu.ec/ares/tmp/SIIU/anuncios/sello_400.png"
              alt="Sello UCE"
              className="w-24 h-24 object-contain"
            />
          </div>

          {/* Title centered */}
          <div className="mb-6 text-center">
            <h1 className="text-[#003f8f] text-2xl font-semibold mb-2">
              Create account
            </h1>
            <p className="text-gray-600">Sign up to start booking facilities</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm text-gray-700 mb-2"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  {...registerField("name")}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cbab42] focus:border-transparent transition-all"
                />
              </div>
              {errors.name?.message && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Faculty */}
            <div>
              <label
                htmlFor="faculty"
                className="block text-sm text-gray-700 mb-2"
              >
                Faculty
              </label>
              <select
                id="faculty"
                name="faculty"
                {...registerField("faculty")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cbab42] focus:border-transparent transition-all"
              >
                <option value="">Select faculty</option>
                {FACULTIES.map((faculty) => (
                  <option key={faculty} value={faculty}>
                    {faculty}
                  </option>
                ))}
              </select>
              {errors.faculty?.message && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.faculty.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm text-gray-700 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu.email@uce.edu.ec"
                  {...registerField("email")}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cbab42] focus:border-transparent transition-all"
                />
              </div>
              {errors.email?.message && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  {...registerField("password")}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cbab42] focus:border-transparent transition-all"
                />
              </div>
              {errors.password?.message && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  {...registerField("confirmPassword")}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cbab42] focus:border-transparent transition-all"
                />
              </div>
              {errors.confirmPassword?.message && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#cbab42] hover:bg-[#b89935] text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-[#003f8f] hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right Column - Illustration */}
      <div className="hidden lg:flex flex-1 bg-[#003f8f] items-center justify-center p-12 relative overflow-hidden">
        <div className="relative z-10 max-w-lg text-center">
          <div className="relative w-full h-[420px] md:h-[580px]">
            <ImageWithFallback
              src="https://i.ibb.co/Kc4Yx5rZ/Chat-GPT-Image-23-dic-2025-07-51-26-p-m.png"
              alt="Illustration"
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#cbab42]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#cbab42]/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
