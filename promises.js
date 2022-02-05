const RpcClient = require("./lib");

let rpc = null;

const formatArgs = argarray => {
  if (!argarray) {
    argarray = [];
  }
  for (let i = 0; i < argarray.length; i++) {
    if (Array.isArray(argarray[i]) || typeof argarray[i] == "object") {
      argarray[i] = JSON.stringify(argarray[i]);
    }
  }
  return argarray;
};

const rpcFunction = (functionName, argarray) =>
  new Promise(resolve =>
    rpc[functionName](
      ...[
        ...formatArgs(argarray),
        ...[
          (err, res) =>
            resolve(
              err
                ? { error: err }
                : typeof res.result != "undefined"
                ? res.result
                : res
            )
        ]
      ]
    )
  );

const rpcs = {
  loadSystem: (user, pass, host, port, protocol) => {
    protocol = protocol ? protocol : "http";
    rpc = new RpcClient({ user, pass, host, port, protocol });
  }
};

for (let x in rpc) {
  const functionName = x;
  if (!rpcs[functionName]) {
    rpcs[functionName] = (...args) =>
      rpcFunction(functionName, args ? args : []);
  }
}

module.exports = rpcs;
