import React, { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useForm } from "react-hook-form";
import axios from "axios";
import { rules } from "../../utils/rules";

export default function Register({ onClose }) {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const currentYear = new Date().getFullYear();
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from(
    { length: currentYear - 1899 },
    (_, i) => currentYear - i
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [isRegistered, setIsRegistered] = useState(false);

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("http://localhost:5000/users/register", {
        name: data.name,
        email: data.email,
        password: data.password,
        confirm_password: data.confirm_password,
        date_of_birth: `${data.year}-${data.month
          .toString()
          .padStart(2, "0")}-${data.day.toString().padStart(2, "0")}`,
      });

      console.log("Registration successful:", res.data);
      setIsRegistered(true);
      setTimeout(() => {
        setIsRegistered(false);
        onClose(); // Close the modal after displaying the toast
      }, 3000);
    } catch (err) {
      console.log("Registration failed", err);
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="overlay flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          Threads
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 mb-14">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-4 sm:pr-8 sm:pl-8">
            <button onClick={onClose} className="close-button">
              <i className="fas fa-times"></i>
            </button>
            {isRegistered && (
              <div
                className="flex text-center bg-green-500 text-white justify-center border px-4 py-3 mb-3 rounded relative"
                role="alert"
              >
                <span className="block">Đăng ký thành công!</span>
              </div>
            )}
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Tạo một tài khoản
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div>
                <input
                  type="text"
                  id="name"
                  placeholder="Tên"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  {...register("name", rules.name)}
                />
                <div className="mt-1 text-red-600 min-h-[1rem] text-sm">
                  {errors.name?.message}
                </div>
              </div>
              <div>
                <input
                  type="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Email"
                  {...register("email", rules.email)}
                />
                <div className="mt-1 text-red-600 min-h-[1rem] text-sm">
                  {errors.email?.message}
                </div>
              </div>
              <div>
                <input
                  type="password"
                  id="password"
                  placeholder="Mật khẩu"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  {...register("password", rules.password)}
                />
                <div className="mt-1 text-red-600 min-h-[1rem] text-sm">
                  {errors.password?.message}
                </div>
              </div>
              <div>
                <input
                  type="password"
                  id="confirm_password"
                  placeholder="Xác nhận mật khẩu"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  {...register("confirm_password", rules.confirm_password)}
                />
                <div className="mt-1 text-red-600 min-h-[1rem] text-sm">
                  {errors.confirm_password?.message}
                </div>
              </div>

              <h2 className="text-sm font-bold">Ngày sinh</h2>
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label
                      htmlFor="day"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Ngày
                    </label>
                    <select
                      id="day"
                      value={day}
                      {...register("day", rules.day)}
                      onChange={(e) => setDay(Number(e.target.value) || "")}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Chọn ngày</option>
                      {days.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    <div className="mt-1 text-red-600 min-h-[1rem] text-sm">
                      {errors.day?.message}
                    </div>
                  </div>

                  <div className="flex-1">
                    <label
                      htmlFor="month"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Tháng
                    </label>
                    <select
                      id="month"
                      value={month}
                      {...register("month", rules.month)}
                      onChange={(e) => setMonth(Number(e.target.value) || "")}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Chọn tháng</option>
                      {months.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <div className="mt-1 text-red-600 min-h-[1rem] text-sm">
                      {errors.month?.message}
                    </div>
                  </div>

                  <div className="flex-1">
                    <label
                      htmlFor="year"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Năm
                    </label>
                    <select
                      id="year"
                      value={year}
                      {...register("year", rules.year)}
                      onChange={(e) => setYear(Number(e.target.value) || "")}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Chọn năm</option>
                      {years.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                    <div className="mt-1 text-red-600 min-h-[1rem] text-sm">
                      {errors.year?.message}
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Tạo tài khoản
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Bạn đã có tài khoản?{" "}
                <a
                  href="#"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Đăng nhập ở đây
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
