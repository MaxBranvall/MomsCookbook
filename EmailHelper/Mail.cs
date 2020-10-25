using MimeKit;
using MailKit.Net.Smtp;

namespace EmailHelper
{
    public class Mail
    {

        public string subject { get; set; }
        public string body { get; set; }
        private string _nameOfSender { get; set; }
        private string _sender { get; set; }
        private string _senderPassword { get; set; }
        private string _host { get; set; }
        private int _port { get; set; }
        private MimeMessage _message = new MimeMessage();

        public Mail(string nameOfSender, string sender, string senderPassword, string host, int port)
        {
            this._nameOfSender = nameOfSender;
            this._sender = sender;
            this._senderPassword = senderPassword;
            this._host = host;
            this._port = port;
        }

        public void ComposeEmail(string recipientName, string recipientEmail, string subject, string body)
        {
            this._message.From.Add(new MailboxAddress(this._nameOfSender, this._sender));
            this._message.To.Add(new MailboxAddress(recipientName, recipientEmail));
            this._message.Subject = subject;
            this._message.Body = new TextPart()
            {
                Text = body
            };
        }

        public void SendMessage()
        {
            using (var client = new SmtpClient())
            {
                client.Connect(this._host, this._port, MailKit.Security.SecureSocketOptions.SslOnConnect);
                client.Authenticate(this._sender, this._senderPassword);
                client.Send(this._message);
                client.Disconnect(true);
            }
        }

    }
}
