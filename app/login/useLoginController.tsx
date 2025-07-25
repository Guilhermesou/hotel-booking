import { useForm } from "@tanstack/react-form";
import { signIn } from "next-auth/react";
import { useState } from "react";
import z from "zod";

const schema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const useLoginController = () => {
    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        asyncDebounceMs: 1000,
        validators: {
            onChange: schema
        },
        onSubmit: async ({ value }) => {
            const res = await signIn("credentials", {
                redirect: false,
                email: value.email,
                password: value.password,
            });

            if (res?.ok) {
                window.location.href = "/select_hotel"; // ⬅️ redireciona manualmente
            } else {
                setMessage("E-mail ou senha inválidos.");
            }
        },
    });

    // const { setSelectedHotel } = useHotelStore();

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    return {
        form,
        loading,
        message,
    }
};