type ReservationStatus = "PENDING" | "CONFIRMED" | "CHECKED_IN" | "CHECKED_OUT" | "CANCELLED"
type PaymentStatus = "PENDING" | "PAID" | "FAILED"
type ReservationPlatform = "DIRECT" | "BOOKING" | "AIRBNB" | "OTHER"

type Reservation = {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    guestId: number;
    roomId: number;
    checkIn: Date;
    checkOut: Date;
    status: ReservationStatus;
    paymentStatus: PaymentStatus;
    platform: ReservationPlatform;
}