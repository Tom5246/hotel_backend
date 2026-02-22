const Reservation = require('../models/Reservation');
const Room = require('../models/Room');

class ReservationController {
  static async createReservation(req, res) {
    try {
      const { hotelId, roomId, checkIn, checkOut, guests, contactName, contactPhone, specialRequests, promotionId } = req.body;
      const userId = req.user.id;

      if (!hotelId || !roomId || !checkIn || !checkOut || !contactName || !contactPhone) {
        return res.error('酒店ID、房型ID、入住日期、退房日期、联系人姓名和联系电话不能为空');
      }

      const room = await Room.findById(roomId);
      if (!room) {
        return res.error('房型不存在', 404);
      }

      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

      if (nights <= 0) {
        return res.error('退房日期必须晚于入住日期');
      }

      const totalPrice = room.price * nights;

      const reservationNo = await Reservation.generateReservationNo();

      const reservationId = await Reservation.create({
        reservation_no: reservationNo,
        user_id: userId,
        hotel_id: hotelId,
        room_id: roomId,
        check_in_date: checkIn,
        check_out_date: checkOut,
        total_price: totalPrice,
        guest_info: guests || [],
        contact_name: contactName,
        contact_phone: contactPhone,
        special_requests: specialRequests,
        promotion_id: promotionId
      });

      const reservation = await Reservation.findById(reservationId);

      res.success({
        reservationId: reservation.reservation_no,
        totalPrice: reservation.total_price,
        status: reservation.status,
        createdAt: reservation.created_at
      }, '预订成功', 201);
    } catch (error) {
      console.error('创建预订失败:', error);
      res.error('创建预订失败', 500);
    }
  }

  static async getUserReservations(req, res) {
    try {
      const userId = req.user.id;
      const { status } = req.body;

      const filters = {};
      if (status) filters.status = status;

      const reservations = await Reservation.findByUserId(userId, filters);

      const items = reservations.map(reservation => ({
        id: reservation.reservation_no,
        hotelName: '',
        roomType: '',
        checkIn: reservation.check_in_date,
        checkOut: reservation.check_out_date,
        totalPrice: reservation.total_price,
        status: reservation.status,
        createdAt: reservation.created_at
      }));

      res.success({
        total: items.length,
        items
      });
    } catch (error) {
      console.error('获取预订列表失败:', error);
      res.error('获取预订列表失败', 500);
    }
  }

  static async cancelReservation(req, res) {
    try {
      const reservationId = req.params.reservationId;
      const userId = req.user.id;

      const reservation = await Reservation.findByReservationNo(reservationId);
      if (!reservation) {
        return res.error('预订不存在', 404);
      }

      if (reservation.user_id !== userId) {
        return res.error('无权取消此预订', 403);
      }

      if (reservation.status === 'cancelled') {
        return res.error('预订已取消');
      }

      if (reservation.status === 'completed' || reservation.status === 'no_show') {
        return res.error('无法取消已完成的预订');
      }

      await Reservation.cancel(reservation.id);

      const updatedReservation = await Reservation.findById(reservation.id);
      res.success({
        id: updatedReservation.reservation_no,
        status: updatedReservation.status
      });
    } catch (error) {
      console.error('取消预订失败:', error);
      res.error('取消预订失败', 500);
    }
  }
}

module.exports = ReservationController;