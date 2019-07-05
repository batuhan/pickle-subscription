import React from "react";
import {Fetcher} from "servicebot-base-form";
import { duotoneDark } from 'react-syntax-highlighter/styles/prism';
import SyntaxHighlighter from 'react-syntax-highlighter/prism';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Load from '../../../views/components/utilities/load.jsx';

class ManagementEmbed extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loading:true,
            selectedServer: "node",
            copied: false,
        };
        this.changeServer = this.changeServer.bind(this);
        this.handleCopy = this.handleCopy(this);
    }

    async componentDidMount(){
        const secretKey = (await Fetcher(`/api/v1/system-options/secret`)).secret;
        this.setState({secretKey, loading:false});
    }

    changeServer(e) {
        const selectedServer = e.currentTarget.value;
        this.setState({selectedServer});
    }

    handleCopy(){
        const self = this;
        this.setState({'copied': true}, function () {
            setTimeout(function(){ self.setState({'copied': false}) }, 3000);
        });
    }

    render() {
        if(this.state.loading){
            return <Load />;
        }
        let server;
        switch (this.state.selectedServer) {
            case "node":
                server = `function generateJWT(email, key) {
    var crypto = require('crypto');
    var hmac = crypto.createHmac('sha256', key); 

    var payload = {
        "email": email
    };
    var header = {
        "alg": "HS256",
        "typ": "JWT"
    };
    function cleanBase64(string) {
        return string.replace(/=/g, "").replace(/\\+/g, "-").replace(/\\//g, "_")
    }

    function base64encode(object) { 
        return cleanBase64(Buffer.from(JSON.stringify(object)).toString("base64"));
    }

    var data = base64encode(header) + "." + base64encode(payload);
    hmac.update(data);
    return data + "." + cleanBase64(hmac.digest('base64'));
}
var SECRET_KEY = "${this.state.secretKey}"; //keep this key safe!
var userToken = generateJWT(user.email, SECRET_KEY);`;
                break;
            case "php":
                server = `function generateJWT($email, $secret) {
    function cleanBase64($string) {
        return str_replace("/", "_", str_replace("+", "-", str_replace("=", "", $string)));
    };
    function base64encode($object) {
        return cleanBase64(base64_encode(json_encode($object)));
    };
    $header = new stdClass();
    $header->alg = "HS256";
    $header->typ = "JWT";
    $payload = new stdClass();
    $payload->email = $email;
    $data = base64encode($header) . "." . base64encode($payload);
    return $data . "." . cleanBase64(base64_encode(pack('H*', hash_hmac('sha256', // hash function
    $data,
    $secret
    ))));
}
$SECRET_KEY = "${this.state.secretKey}";
$userToken = generateJWT($user->email, $SECRET_KEY);
`;
                break;
            case "ruby":
                server = `require "openssl"
require "base64"
require "json"

def generateJWT(email, secret)
  def clearPadding(string)
    string.gsub! "=", ""
    return string
  end

  def encodeClear(obj)
    return clearPadding(Base64.urlsafe_encode64(JSON.generate(obj)))
  end

  header = {:alg => "HS256", :typ => "JWT"}
  payload = {:email => email}
  data = encodeClear(header) + "." + encodeClear(payload)
  return data + "." + clearPadding(Base64.urlsafe_encode64(OpenSSL::HMAC.digest('sha256', secret, data)))
end

SECRET_KEY = "${this.state.secretKey}" #Keep this key safe!
userToken = generateJWT(user[:email], SECRET_KEY)
`;
                break;
            case "python":
                server = `#Requires PyJWT package, "pip install PyJWT"
import jwt
def generateJWT(email, secret):
  encoded = jwt.encode({'email': email}, secret)
  return encoded
  
SECRET_KEY = "${this.state.secretKey}" #Keep this key safe!
token = generateJWT(user.email, SECRET_KEY)`;
                break;
            case "other":
                server = `Generate a JSON Web Token using the following specifications:
    - Algorithm: HS256
    - HMAC Secret: ${this.state.secretKey}
    - Payload should contain a customer email address, for example: {"email" : "customer-email@example.com"}`;
                break;
            default:
                break;
        }
        const clientCode = `<div id="servicebot-request-form"></div>
<script src="https://js.stripe.com/v3/"></script>
<script src="https://js.servicebot.io/js/servicebot-billing-settings-embed.js" type="text/javascript"></script>
<script  type="text/javascript">
    Servicebot.BillingSettings({
        url : "${window.location.origin}",
        selector : document.getElementById('servicebot-request-form'),
        handleResponse : (response) => {
            console.log(response);
            //determine what to do on certain events...
        },
        token: "INSERT_TOKEN_HERE"
    })
</script>
`;

        const {copied, selectedServer} = this.state;

        const selectedLang = ( selected )=> {
            switch (selected){
                case "node" || 'other':
                    return 'javascript'; break;
                default:
                    return selected;
            }
        };

        return (
          <div id="plugin_embeddable-billing-settings" className="plugin_container">
            <div id="_section-1" className={`_section ${selectedServer && '_active'}`}>
              <span className="caret" />
              <h3>
                <span className="form-step-count">1</span>
Select a Language or Framework
              </h3>
              <div className="_indented">
                <p className="form-help-text">
                  {' '}
In order to embed the management so users can add cards, cancel, and resubscribe
                            you need to generate a token which will authenticate your users and be used by
                            the client-side javascript.
                </p>
                <div className="sb-form-group">
                  <select className="_input- _input-select-a-framework" onChange={this.changeServer} value={selectedServer}>
                    <option value="node">NodeJS</option>
                    <option value="php">PHP</option>
                    <option value="ruby">Rails/Ruby</option>
                    <option value="python">Python</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
            <div id="_section-2" className={`_section ${selectedServer && '_active'}`}>
              <span className="caret" />
              <h3>
                <span className="form-step-count">2</span>
Server-side Embed Code
              </h3>
              <div className="_indented">
                <p className="form-help-text">
                  <strong>DO NOT EXPOSE THE SECRET KEY TO THE PUBLIC</strong>
, make sure not to commit
                            it into version control or send under insecure channels or expose to client
                </p>
                <SyntaxHighlighter showLineNumbers language={selectedLang(selectedServer)} style={duotoneDark}>{server}</SyntaxHighlighter>
                <CopyToClipboard text={server} onCopy={this.handleCopy}>
                  <button className="buttons _success _right __copied">{copied ? 'Copied!' : 'Copy Server Code'}</button>
                </CopyToClipboard>
                <div className="clear" />
              </div>
            </div>
            <div id="_section-3" className={`_section ${selectedServer && '_active'}`}>
              <span className="caret" />
              <h3>
                <span className="form-step-count">3</span>
Client-side Embed Code
              </h3>
              <div className="_indented">
                <p className="form-help-text">
With the token generated on the server, use this HTML on the client...(with the proper token) for technical documentation,
                  <a href="https://docs.servicebot.io/billing-settings-embed">see here</a>
                </p>
                <SyntaxHighlighter showLineNumbers language='javascript' style={duotoneDark}>{clientCode}</SyntaxHighlighter>
                <CopyToClipboard text={clientCode} onCopy={this.handleCopy}>
                  <button className="buttons _success _right __copied">{copied ? 'Copied!' : 'Copy Client Code'}</button>
                </CopyToClipboard>
                <div className="clear" />
              </div>
            </div>
          </div>
        );
    }
}

export default {component : ManagementEmbed, name: "Billing Settings", description: "Test reload", iconUrl: "data:image/svg+xml;utf8,%3Csvg width='56px' height='56px' viewBox='0 0 56 56' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3C!-- Generator: Sketch 49 (51002) - http://www.bohemiancoding.com/sketch --%3E%3Ctitle%3ESB/Icon/EmbedPage/Billing%3C/title%3E%3Cdesc%3ECreated with Sketch.%3C/desc%3E%3Cdefs%3E%3C/defs%3E%3Cg id='SB/Icon/EmbedPage/Billing' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cg id='Group-7' transform='translate(4.000000, 6.000000)' fill='%234C82FC' fill-rule='nonzero'%3E%3Cg id='credit-card-(1)' transform='translate(17.066667, 22.500000)'%3E%3Cpath d='M2.76000015,1.06153846 C1.82196566,1.06153846 1.06153846,1.82196566 1.06153846,2.76000015 L1.06153846,19.7399998 C1.06153846,20.6780343 1.82196566,21.4384615 2.76000015,21.4384615 L28.1733332,21.4384615 C29.1113677,21.4384615 29.8717949,20.6780343 29.8717949,19.7399998 L29.8717949,2.76000015 C29.8717949,1.82196566 29.1113677,1.06153846 28.1733332,1.06153846 L2.76000015,1.06153846 Z M2.76000015,-1.06153846 L28.1733332,-1.06153846 C30.2839107,-1.06153846 31.9948718,0.649422655 31.9948718,2.76000015 L31.9948718,19.7399998 C31.9948718,21.8505773 30.2839107,23.5615385 28.1733332,23.5615385 L2.76000015,23.5615385 C0.649422655,23.5615385 -1.06153846,21.8505773 -1.06153846,19.7399998 L-1.06153846,2.76000015 C-1.06153846,0.649422655 0.649422655,-1.06153846 2.76000015,-1.06153846 Z' id='Rectangle-path'%3E%3C/path%3E%3Cpath d='M0,9.49903846 C-0.586271504,9.49903846 -1.06153846,9.0237715 -1.06153846,8.4375 C-1.06153846,7.8512285 -0.586271504,7.37596154 0,7.37596154 L30.9333333,7.37596154 C31.5196048,7.37596154 31.9948718,7.8512285 31.9948718,8.4375 C31.9948718,9.0237715 31.5196048,9.49903846 30.9333333,9.49903846 L0,9.49903846 Z' id='Shape'%3E%3C/path%3E%3C/g%3E%3Cg id='settings-(3)-copy'%3E%3Cpath d='M22.88037,15.1220564 C23.1346505,15.6503136 22.9125486,16.2846858 22.3842914,16.5389664 C21.8560342,16.793247 21.221662,16.571145 20.9673814,16.0428879 C20.3468924,14.7538481 19.0480981,13.9186813 17.6,13.9186813 C15.5363658,13.9186813 13.8615385,15.6009856 13.8615385,17.6785714 C13.8615385,18.7402597 14.2998891,19.7284622 15.0587396,20.4362254 C15.4874767,20.8360989 15.5108752,21.5078205 15.1110016,21.9365575 C14.7111281,22.3652945 14.0394065,22.388693 13.6106695,21.9888195 C12.4253659,20.8833131 11.7384615,19.3347795 11.7384615,17.6785714 C11.7384615,14.4305543 14.3617006,11.7956044 17.6,11.7956044 C19.8724679,11.7956044 21.9097558,13.1056464 22.88037,15.1220564 Z' id='Oval'%3E%3C/path%3E%3Cpath d='M9.30346664,6.29602535 L9.20414106,6.19625613 C8.78485344,5.77462788 8.21654945,5.53799174 7.62424242,5.53799174 C7.0319354,5.53799174 6.46363141,5.77462788 6.04351059,6.19709304 C5.62284967,6.61916209 5.38621761,7.19254169 5.38621761,7.79074675 C5.38621761,8.38895181 5.62284967,8.96233141 6.0439273,9.38481881 L6.15105044,9.49251167 C7.2304409,10.6009049 7.52924774,12.2562269 6.93136446,13.6117406 C6.3959872,15.0739124 5.02367926,16.0598125 3.44533333,16.0966034 L3.2969697,16.0966034 C2.06343622,16.0966034 1.06153846,17.1029739 1.06153846,18.3467532 C1.06153846,19.5905326 2.06343622,20.5969031 3.2969697,20.5969031 L3.58146477,20.5969116 C5.0898097,20.6029543 6.44964312,21.5075265 7.03828893,22.8872694 C7.66112652,24.3048121 7.36231969,25.960134 6.27471518,27.0768695 L6.17538938,27.1766385 C5.75472846,27.5987075 5.51809639,28.1720871 5.51809639,28.7702922 C5.51809639,29.3684973 5.75472846,29.9418769 6.17622257,30.3647828 C6.5955102,30.7864111 7.16381419,31.0230472 7.75612121,31.0230472 C8.34842824,31.0230472 8.91673222,30.7864111 9.33643633,30.3643643 L9.44365179,30.2567617 C10.5489929,29.1707112 12.2025458,28.8695527 13.618091,29.4970783 C14.154058,29.7346779 14.3959326,30.3617776 14.158333,30.8977447 C13.9207334,31.4337117 13.2936337,31.6755863 12.7576666,31.4379867 C12.1386845,31.1635857 11.4160349,31.2952005 10.9399273,31.7629085 L10.8414347,31.8618405 C10.0239086,32.6839304 8.91390668,33.1461241 7.75612121,33.1461241 C6.59833574,33.1461241 5.48833382,32.6839304 4.67164093,31.8626775 C3.8541114,31.0424113 3.39501947,29.9299926 3.39501947,28.7702922 C3.39501947,27.6105919 3.8541114,26.4981731 4.67122421,25.6783253 L4.76191926,25.5873169 C5.2375969,25.098858 5.36963998,24.3673693 5.09004983,23.7308873 C4.82906508,23.1192267 4.23284333,22.7226151 3.57721212,22.71998 L3.2969697,22.71998 C0.888771007,22.71998 -1.06153846,20.7609638 -1.06153846,18.3467532 C-1.06153846,15.9325427 0.888771007,13.9735265 3.2969697,13.9735265 L3.42039894,13.9738194 C4.10012118,13.957849 4.70205732,13.5254032 4.96268077,12.8197369 C5.23776119,12.1936696 5.10571811,11.462181 4.63825451,10.9820643 L4.53976214,10.883132 C3.72223261,10.0628658 3.26314068,8.9504471 3.26314068,7.79074675 C3.26314068,6.6310464 3.72223261,5.51862766 4.53892894,4.69919842 C5.35645503,3.87710859 6.46645695,3.41491482 7.62424242,3.41491482 C8.7820279,3.41491482 9.89202981,3.87710859 10.7091394,4.69877985 L10.7997422,4.78987857 C11.2841561,5.26583848 12.0068058,5.39745331 12.6257878,5.12305229 C12.7217111,5.08052852 12.823186,5.05255876 12.9268645,5.03985186 C13.4441236,4.74820804 13.7724226,4.19635111 13.7748252,3.59318182 L13.7748252,3.31168831 C13.7748252,0.897477746 15.7251346,-1.06153846 18.1333333,-1.06153846 C20.541532,-1.06153846 22.4918415,0.897477746 22.4918415,3.31168831 L22.4918331,3.45649936 C22.4944815,4.12348304 22.8906038,4.72429805 23.5090001,4.99058475 C24.1279821,5.26498578 24.8506317,5.13337095 25.3267394,4.66566296 L25.425232,4.56673089 C26.2427581,3.74464106 27.35276,3.28244729 28.5105455,3.28244729 C29.6683309,3.28244729 30.7783328,3.74464106 31.5950257,4.56589397 C32.4125553,5.38616013 32.8716472,6.49857887 32.8716472,7.65827922 C32.8716472,8.81797957 32.4125553,9.93039831 31.5954425,10.7502461 L31.5047474,10.8412546 C31.0290698,11.3297135 30.8970267,12.0612021 31.1721071,12.6872694 C31.214321,12.7833458 31.2419612,12.8849337 31.2543239,12.9886817 C31.5445173,13.5094794 32.0923476,13.8386591 32.6894545,13.8410589 L32.969697,13.8410589 C33.5559685,13.8410589 34.0312354,14.3163259 34.0312354,14.9025974 C34.0312354,15.4888689 33.5559685,15.9641359 32.969697,15.9641359 L32.6852019,15.9641273 C31.176857,15.9580847 29.8170235,15.0535124 29.223868,13.6633549 C29.178148,13.5562026 29.1504499,13.4424258 29.1417124,13.3266172 C28.6374503,11.9592967 28.9588197,10.4125057 29.9919515,9.35170193 L30.0912773,9.25193293 C30.5119382,8.82986388 30.7485703,8.25648428 30.7485703,7.65827922 C30.7485703,7.06007416 30.5119382,6.48669456 30.0904441,6.06378859 C29.6711565,5.64216035 29.1028525,5.40552421 28.5105455,5.40552421 C27.9182384,5.40552421 27.3499344,5.64216035 26.9302303,6.06420717 L26.8230149,6.17180974 C25.7176738,7.25786021 24.0641209,7.55901872 22.659039,6.93606449 C21.2740507,6.33982647 20.3747722,4.97585391 20.3687646,3.46071429 L20.3687646,3.31168831 C20.3687646,2.06790898 19.3668668,1.06153846 18.1333333,1.06153846 C16.8997999,1.06153846 15.8979021,2.06790898 15.8979021,3.31168831 L15.8978937,3.59739675 C15.8918944,5.10832144 14.992616,6.472294 13.6076277,7.06853202 C13.5003573,7.11471196 13.3863785,7.14279875 13.270316,7.15183923 C11.905246,7.65909078 10.3609471,7.33513643 9.30346664,6.29602535 Z' id='Shape'%3E%3C/path%3E%3C/g%3E%3Cpath d='M22.3974359,35.8879121 L22.3974359,35.8978022 L42.6692308,35.8978022 L42.6692308,35.8879121 L22.3974359,35.8879121 Z M22.3974359,34.8263736 L42.6692308,34.8263736 C43.2555023,34.8263736 43.7307692,35.3016406 43.7307692,35.8879121 L43.7307692,35.8978022 C43.7307692,36.4840737 43.2555023,36.9593407 42.6692308,36.9593407 L22.3974359,36.9593407 C21.8111644,36.9593407 21.3358974,36.4840737 21.3358974,35.8978022 L21.3358974,35.8879121 C21.3358974,35.3016406 21.8111644,34.8263736 22.3974359,34.8263736 Z' id='Rectangle-6'%3E%3C/path%3E%3Cpath d='M22.3974359,39.1021978 L22.3974359,39.1120879 L33.0692308,39.1120879 L33.0692308,39.1021978 L22.3974359,39.1021978 Z M22.3974359,38.0406593 L33.0692308,38.0406593 C33.6555023,38.0406593 34.1307692,38.5159263 34.1307692,39.1021978 L34.1307692,39.1120879 C34.1307692,39.6983594 33.6555023,40.1736264 33.0692308,40.1736264 L22.3974359,40.1736264 C21.8111644,40.1736264 21.3358974,39.6983594 21.3358974,39.1120879 L21.3358974,39.1021978 C21.3358974,38.5159263 21.8111644,38.0406593 22.3974359,38.0406593 Z' id='Rectangle-6-Copy'%3E%3C/path%3E%3Cpath d='M40.5307692,39.1021978 L40.5307692,39.1120879 L42.6692308,39.1120879 L42.6692308,39.1021978 L40.5307692,39.1021978 Z M40.5307692,38.0406593 L42.6692308,38.0406593 C43.2555023,38.0406593 43.7307692,38.5159263 43.7307692,39.1021978 L43.7307692,39.1120879 C43.7307692,39.6983594 43.2555023,40.1736264 42.6692308,40.1736264 L40.5307692,40.1736264 C39.9444977,40.1736264 39.4692308,39.6983594 39.4692308,39.1120879 L39.4692308,39.1021978 C39.4692308,38.5159263 39.9444977,38.0406593 40.5307692,38.0406593 Z' id='Rectangle-6-Copy-2'%3E%3C/path%3E%3C/g%3E%3C/g%3E%3C/svg%3E"}