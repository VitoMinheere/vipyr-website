// Kubernetes CLI commands for CKA, CKAD, CKS
const commands = [
  // General (CKA)
  "kubectl get nodes",
  "kubectl drain node01 --ignore-daemonsets",
  "kubectl cordon node01",
  "kubectl uncordon node01",
  "kubectl describe node node01",
  "kubectl get componentstatuses",
  "kubectl get events --sort-by=.metadata.creationTimestamp",
  "kubectl apply -f deployment.yaml",
  "kubectl delete deployment nginx",
  "kubectl scale deployment nginx --replicas=3",
  "kubectl rollout restart deployment nginx",
  "kubectl get csr",
  "kubectl certificate approve my-csr",
  "kubeadm init",
  "kubeadm join 10.0.0.1:6443 --token abcdef.0123456789abcdef --discovery-token-ca-cert-hash sha256:xyz",
  // CKAD
  "kubectl run busybox --image=busybox --restart=Never -it -- sh",
  "kubectl expose deployment nginx --port=80 --target-port=80 --name=nginx-service",
  "kubectl create secret generic mysecret --from-literal=password=1234",
  "kubectl get pods --show-labels",
  "kubectl label pod nginx env=prod",
  "kubectl annotate pod nginx owner=vito",
  "kubectl config set-context ckad --namespace=dev --cluster=kubernetes --user=admin",
  "kubectl config use-context ckad",
  // CKS
  "kubectl get networkpolicy -n secure-ns",
  "kubectl auth can-i create pods --as system:serviceaccount:default:myuser",
  "kubectl logs nginx -c sidecar",
  "kubectl delete pod --grace-period=0 --force nginx",
  "kubectl taint nodes node1 key=value:NoSchedule",
  "kubectl top pod --all-namespaces",
  "kubectl port-forward pod/mypod 8080:80",
  "kubectl exec -it mypod -- bash",
  "kubectl label ns secure-ns pod-security.kubernetes.io/enforce=baseline",
  "kubectl create configmap myconfig --from-literal=env=prod",
  "kubectl get secrets -o json | jq .items[].data",
  "kubectl get auditpolicies -o yaml",
  "kubectl explain pod.spec.securityContext",

   // Imperative commands
  "kubectl create deployment nginx --image=nginx",
  "kubectl create namespace dev",
  "kubectl run testpod --image=nginx --restart=Never",
  "kubectl expose pod testpod --port=80 --target-port=80 --name=test-service",
  "kubectl create service clusterip myservice --tcp=5678:8080",
  "kubectl autoscale deployment nginx --cpu-percent=70 --min=2 --max=5",
  "kubectl set image deployment/nginx nginx=nginx:1.19.3",
  "kubectl set resources deployment nginx --limits=cpu=200m,memory=512Mi",
  "kubectl set env deployment nginx ENV=prod",
  'kubectl run nginx --image=nginx --port=80 --labels="app=web,env=prod"'
];

const totalCommands = commands.length;
const totalElem = document.getElementById('total-commands');
const amountInput = document.getElementById('amount');
const startBtn = document.getElementById('start-btn');
const setupDiv = document.getElementById('setup');
const practiceDiv = document.getElementById('practice');
const commandPrompt = document.getElementById('command-prompt');
const userInput = document.getElementById('user-input');
const submitBtn = document.getElementById('submit-btn');
const feedbackDiv = document.getElementById('feedback');
const doneDiv = document.getElementById('done');

let shuffled = [];
let current = 0;
let amount = totalCommands;

totalElem.textContent = `There are ${totalCommands} total available commands.`;
amountInput.max = totalCommands;
amountInput.value = totalCommands;

function shuffle(array) {
  // Fisher-Yates shuffle
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

startBtn.addEventListener('click', () => {
  let val = parseInt(amountInput.value, 10);
  if (isNaN(val) || val < 1 || val > totalCommands) {
    feedbackDiv.textContent = `❌ Invalid number. Using full list (${totalCommands}).`;
    amount = totalCommands;
  } else {
    amount = val;
    feedbackDiv.textContent = '';
  }
  shuffled = shuffle([...commands]).slice(0, amount);
  current = 0;
  setupDiv.style.display = 'none';
  practiceDiv.style.display = '';
  doneDiv.style.display = 'none';
  userInput.value = '';
  feedbackDiv.textContent = '';
  showCommand();
  userInput.focus();
});

function showCommand() {
  commandPrompt.textContent = `Type: ${shuffled[current]}`;
  userInput.value = '';
  feedbackDiv.textContent = '';
}

function checkInput() {
  if (userInput.value === shuffled[current]) {
    feedbackDiv.textContent = '✅ Correct!';
    setTimeout(() => {
      current++;
      if (current < shuffled.length) {
        showCommand();
      } else {
        practiceDiv.style.display = 'none';
        doneDiv.style.display = '';
        doneDiv.innerHTML = `<h2>🎉 Done!</h2><p>Great job practicing ${amount} command(s)!</p><button id='restart-btn'>Practice Again</button>`;
        document.getElementById('restart-btn').onclick = () => {
          setupDiv.style.display = '';
          doneDiv.style.display = 'none';
        };
      }
    }, 600);
  } else {
    feedbackDiv.textContent = '❌ Try again';
  }
}

submitBtn.addEventListener('click', checkInput);
userInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') checkInput();
}); 