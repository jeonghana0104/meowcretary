// 인증 메일 발송 (개발 단계 stub)
//
// 지금은 콘솔에 코드를 출력만 한다. 실제 발송은 운영 단계에서
// nodemailer(학교 SMTP / Gmail 앱 비밀번호) 또는 SendGrid 등을 연결하면 된다.
// 그 자리만 채우면 호출부(routes/user.js)는 그대로 둘 수 있다.
export async function sendVerificationEmail(to, code) {
  console.log(`📧 [메일발송 stub] ${to} → 인증코드: ${code} (5분 유효)`);
  // 예시(운영):
  //   const transporter = nodemailer.createTransport({ ... });
  //   await transporter.sendMail({ to, subject: '[비서냥이] 이메일 인증코드', text: `인증코드: ${code}` });
}
